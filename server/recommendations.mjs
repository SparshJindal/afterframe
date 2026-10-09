import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { buildFilmIndex, earlyRecommendations } from '../public/recommend.js';
import { fitTaste, modelAspectIds } from '../public/model.js';
import { rankHybrid } from './hybrid.mjs';

export function journalFingerprint(own) {
  // No notes, emails, spoilers or social content enter the ranking fingerprint.
  const rows = own.map(r => [r.movieId, r.id || '', r.overall, r.createdAt, (r.answers || []).map(a => [a.aspectId, a.score]).sort((a, b) => a[0].localeCompare(b[0]))]);
  rows.sort((a, b) => a[0].localeCompare(b[0]));
  return createHash('sha256').update(JSON.stringify(rows)).digest('hex');
}

export async function createRecommender({ pool, root, movieSelect, getRatings, populationPrior }) {
  const historical = JSON.parse(gunzipSync(Buffer.from(await fs.readFile(root + '/catalogue/collaborative.json.gz.b64', 'utf8'), 'base64')).toString('utf8'));
  let filmsMemo = null, filmsJob = null, revision = 0;
  const profiles = new Map(), jobs = new Map();
  async function films() {
    if (filmsMemo && filmsMemo.until > Date.now()) return filmsMemo;
    if (filmsJob?.revision === revision) return filmsJob.promise;
    const generation = revision;
    const promise = (async () => {
      const movies = (await pool.query(movieSelect)).rows;
      const value = { until: Date.now() + 60000, movies, index: buildFilmIndex(movies) };
      if (generation === revision) filmsMemo = value;
      return value;
    })();
    filmsJob = { revision: generation, promise };
    try { return await promise; } finally { if (filmsJob?.promise === promise) filmsJob = null; }
  }
  async function context(id) {
    const sql = `SELECT s.*,ARRAY(SELECT movie_id FROM watchlist WHERE profile_id=$1) AS saved,
      ARRAY(SELECT movie_id FROM recommendation_feedback WHERE profile_id=$1) AS hidden
      FROM recommendation_shelves s WHERE s.profile_id=$1`;
    let row = (await pool.query(sql, [id])).rows[0];
    if (!row) {
      await pool.query('INSERT INTO recommendation_shelves(profile_id) VALUES($1) ON CONFLICT DO NOTHING', [id]);
      row = (await pool.query(sql, [id])).rows[0];
    }
    if (!row) throw Error('Recommendation preferences could not be loaded.');
    return row;
  }
  async function profile(id) {
    // Revalidate a DB-backed revision even on cache hits: serverless workers cannot
    // rely on another worker's in-memory invalidation after a successful movie log.
    const c = await context(id), key = `${revision}:${id}:${c.input_revision}:${c.refresh_revision}`;
    const cached = profiles.get(id);
    if (cached?.key === key && cached.until > Date.now()) return cached.value;
    if (jobs.has(key)) return jobs.get(key);
    const promise = buildProfile(id, c, key).finally(() => jobs.delete(key));
    jobs.set(key, promise);
    return promise;
  }
  async function buildProfile(id, c, cacheKey) {
    const generation = revision;
    let [own, prior, f] = await Promise.all([getRatings(id), populationPrior(), films()]);
    if (own.some(r => !f.index.byId.has(r.movieId))) { filmsMemo = null; f = await films(); }
    const taste = fitTaste(own, { prior: prior.coefficients, priorSource: prior.source });
    let aspects = [];
    if (taste.ready) {
      const r = await pool.query(`WITH latest AS(SELECT DISTINCT ON(r.profile_id,r.movie_id) r.id,r.movie_id FROM ratings r JOIN profiles p ON p.id=r.profile_id WHERE p.contribute=true AND r.profile_id<>$1 ORDER BY r.profile_id,r.movie_id,r.created_at DESC) SELECT l.movie_id AS "movieId",a.aspect_id AS "aspectId",avg(a.score)::float8 AS score,count(*)::integer AS sample FROM latest l JOIN answers a ON a.rating_id=l.id WHERE a.score IS NOT NULL GROUP BY l.movie_id,a.aspect_id HAVING count(*)>=3`, [id]);
      aspects = r.rows;
    }
    const excluded = new Set([...(c.saved || []), ...(c.hidden || [])]);
    const fingerprint = journalFingerprint(own);
    const shelfKey = createHash('sha256').update(JSON.stringify([fingerprint, [...excluded].sort(), 4])).digest('hex');
    const unchanged = c.journal_key === shelfKey && c.served_revision === c.refresh_revision;
    const picks = rankHybrid(f.index, own, { neighbors: historical.neighbors, taste, aspects, excludeIds: excluded,
      seed: `${id}:${shelfKey}:${c.refresh_revision}`, previousIds: unchanged ? [] : c.movie_ids,
      recentSlates: unchanged ? [] : c.recent_slates, preferredIds: unchanged ? c.movie_ids : null,
      maxRepeats: c.served_revision !== c.refresh_revision ? 2 : 5, limit: 8 });
    const ids = picks.map(r => r.movieId);
    if (!unchanged || JSON.stringify(ids) !== JSON.stringify(c.movie_ids)) {
      const recent = [...(c.recent_slates || []), ...(c.movie_ids?.length ? [c.movie_ids] : [])].slice(-3);
      // A slow read must not overwrite a shelf computed from a newer journal or refresh.
      await pool.query(`UPDATE recommendation_shelves SET journal_key=$2,served_revision=$3,movie_ids=$4,recent_slates=$5,updated_at=now()
        WHERE profile_id=$1 AND refresh_revision=$3 AND input_revision=$6 AND journal_key=$7 AND served_revision=$8`,
      [id, shelfKey, c.refresh_revision, ids, JSON.stringify(recent), c.input_revision, c.journal_key, c.served_revision]);
    }
    const craft = aspects.reduce((map, a) => { if (!map.has(a.movieId)) map.set(a.movieId, []); map.get(a.movieId).push(a); return map; }, new Map());
    const seen = new Set(own.map(r => r.movieId)), estimates = [];
    if (taste.ready) for (const [mid, a] of craft) {
      if (seen.has(mid) || excluded.has(mid) || !modelAspectIds.every(k => a.some(v => v.aspectId === k && v.sample >= 3))) continue;
      estimates.push({ movieId: mid, predicted: Math.max(.5, Math.min(5, taste.intercept + taste.weights.reduce((s, w) => s + w.coefficient * a.find(v => v.aspectId === w.id).score, 0))), sample: Math.min(...a.map(x => x.sample)), reason: 'Experimental estimate from your associations and opt-in viewers’ numerical craft scores.' });
    }
    estimates.sort((a, b) => b.predicted - a.predicted);
    const value = { own, taste, aspects, hidden: c.hidden || [], public: { ...taste, recommendations: estimates.slice(0, 8),
      hybridRecommendations: picks, earlyRecommendations: earlyRecommendations(f.index, own, 8, { excludeIds: excluded }),
      shelf: { hiddenCount: c.hidden?.length || 0, canRefresh: own.length > 0 },
      algorithm: { version: 4, collaborativeSource: historical.source, historicalUsers: historical.userCount, recentLogWeight: .75, accuracyValidated: false } } };
    if (generation === revision) {
      profiles.delete(id);
      if (profiles.size >= 500) profiles.delete(profiles.keys().next().value);
      profiles.set(id, { key: cacheKey, until: Date.now() + 60000, value });
    }
    return value;
  }
  function invalidate() { revision++; filmsMemo = null; profiles.clear(); }
  async function touch(id, client = pool) {
    await client.query(`INSERT INTO recommendation_shelves(profile_id,input_revision) VALUES($1,1)
      ON CONFLICT(profile_id) DO UPDATE SET input_revision=recommendation_shelves.input_revision+1`, [id]);
    profiles.delete(id);
  }
  async function refresh(id) {
    await pool.query(`INSERT INTO recommendation_shelves(profile_id,refresh_revision) VALUES($1,1)
      ON CONFLICT(profile_id) DO UPDATE SET refresh_revision=recommendation_shelves.refresh_revision+1`, [id]);
    profiles.delete(id);
    return (await profile(id)).public;
  }
  async function feedback(id, movieId, dismissed) {
    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      if (dismissed) await c.query('INSERT INTO recommendation_feedback(profile_id,movie_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [id, movieId]);
      else await c.query('DELETE FROM recommendation_feedback WHERE profile_id=$1 AND movie_id=$2', [id, movieId]);
      await touch(id, c);
      await c.query('COMMIT');
    } catch (e) { await c.query('ROLLBACK'); throw e; } finally { c.release(); }
    return (await profile(id)).public;
  }
  return { films, profile, invalidate, touch, refresh, feedback, async discover(id, predicate) {
    const [p, f] = await Promise.all([profile(id), films()]);
    const candidateIds = new Set(f.movies.filter(predicate).map(m => m.id));
    return rankHybrid(f.index, p.own, { neighbors: historical.neighbors, taste: p.taste, aspects: p.aspects,
      limit: 8, discovery: true, candidateIds, excludeIds: new Set(p.hidden), seed: journalFingerprint(p.own) });
  } };
}
