import {createStaticCache} from './server/static.mjs';
import {createRecommender} from './server/recommendations.mjs';
import {createDiscovery} from './server/discovery.mjs';
import {createSocial} from './server/social.mjs';
import {fitPopulationPrior} from './model.mjs';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { randomUUID, randomBytes, createHash } from 'node:crypto';
import pg from 'pg';
import { validateRating, craftScore, fitTaste, latestDistinct, modelAspectIds } from './model.mjs';
import { importCatalogue } from './catalogue/import.mjs';
import { buildFilmIndex, earlyRecommendations } from './public/recommend.js';
import { createAuth, AuthError } from './server/auth.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

let pool = null;
export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw Error('DATABASE_URL is required. Use npm run dev for a local real PostgreSQL instance.');
    const rawDbUrl = process.env.DATABASE_URL;
    const isCloudDb = rawDbUrl.includes('neon.tech') || rawDbUrl.includes('supabase.co') || rawDbUrl.includes('amazonaws.com') || rawDbUrl.includes('sslmode=') || (isProd && !rawDbUrl.includes('localhost'));
    const cleanDbUrl = rawDbUrl.replace(/[?&]sslmode=[^&]+/g, '').replace(/[?&]channel_binding=[^&]+/g, '');
    const sslConfig = process.env.PGSSL === 'true' ? { rejectUnauthorized: true } : isCloudDb ? { rejectUnauthorized: false } : undefined;
    pool = new pg.Pool({ connectionString: cleanDbUrl, max: isProd ? 5 : 10, ssl: sslConfig, connectionTimeoutMillis: 10000 });
  }
  return pool;
}

let initPromise = null;
let auth = null;
let catalogueMeta = null;
let recommender=null,discovery=null,social=null;let populationMemo=null,populationGeneration=0;
const serveStatic=createStaticCache();

export async function ensureInit() {
  if (!initPromise) {
    initPromise = (async () => {
      const p = getPool();
      const runMigrations = !isProd || process.env.RUN_MIGRATIONS === 'true';
      if (runMigrations) {
        await p.query(await fs.readFile(path.join(root, 'db/schema.sql'), 'utf8'));
      }
      const context = { window: {} };
      vm.createContext(context);
      vm.runInContext(await fs.readFile(path.join(root, 'public/data.js'), 'utf8'), context);
      const { MOVIES, ASPECTS } = context.window;
      if (runMigrations) {
        for (const m of MOVIES) {
          await p.query('INSERT INTO movies(id,title,year,director,genres,runtime,poster) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING', [m.id, m.title, m.year, m.director, JSON.stringify(m.genres), m.runtime, m.poster]);
        }
        for (const a of ASPECTS) {
          await p.query('INSERT INTO question_versions(version,aspect_id,label,prompt) VALUES(1,$1,$2,$3) ON CONFLICT DO NOTHING', [a.id, a.name, a.question]);
        }
      }
      try {
        catalogueMeta = await importCatalogue(p, root);
      } catch (err) {
        console.warn('Import catalogue fallback:', err.message);
        catalogueMeta = (await p.query('SELECT metadata FROM catalogue_imports WHERE source=$1', ['MovieLens latest-small'])).rows[0]?.metadata;
      }
      if (!catalogueMeta) throw Error('Catalogue migration is required before starting this app.');

      try {
        await p.query(`
          DELETE FROM ratings r1 USING ratings r2
          WHERE r1.profile_id = r2.profile_id AND r1.movie_id = r2.movie_id AND r1.created_at < r2.created_at;
          CREATE UNIQUE INDEX IF NOT EXISTS ratings_profile_movie ON ratings(profile_id, movie_id);
        `);
      } catch (err) {
        console.warn('Unique index ratings_profile_movie notice:', err.message);
      }

      const rawAppOrigin = process.env.APP_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 3000}`);
      let appOrigin = rawAppOrigin;
      try { appOrigin = new URL(rawAppOrigin).origin; } catch {}
      auth = await createAuth(p, { root, production: isProd, origin: appOrigin, runMigrations });
      try {
        await p.query(await fs.readFile(path.join(root,'db/discovery-schema.sql'),'utf8'));
      } catch (err) {
        if (runMigrations) throw err;
      }
      await p.query('SELECT day FROM llm_daily_budget LIMIT 0');
      if(runMigrations)await p.query(await fs.readFile(path.join(root,'db/recommendation-schema.sql'),'utf8'));
      await p.query('SELECT profile_id FROM recommendation_shelves LIMIT 0');
      recommender=await createRecommender({pool:p,root,movieSelect,getRatings,populationPrior});
      discovery=createDiscovery({pool:p,auth,recommender});
      try {
        await p.query(await fs.readFile(path.join(root,'db/social-schema.sql'),'utf8'));
      } catch (err) {
        if (runMigrations) throw err;
      }
      await p.query('SELECT id FROM friend_connections LIMIT 0');
      social=createSocial({pool:p,auth,body,send});
    })().catch(err => {
      console.error('Database initialization warning:', err.message);
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}


const movieSelect = `SELECT id,title,year,director,genres,runtime,poster,original_title AS "originalTitle",movielens_id AS "movielensId",imdb_id AS "imdbId",tmdb_id AS "tmdbId",tags,rating_count AS "ratingCount",rating_mean::float8 AS "ratingMean",source FROM movies`;
const hash = s => createHash('sha256').update(s).digest('hex');

function send(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

async function body(req) {
  let s = '';
  for await (const chunk of req) {
    s += chunk;
    if (s.length > 32000) throw Object.assign(Error('Request too large.'), { status: 413 });
  }
  try {
    return JSON.parse(s);
  } catch {
    throw Error('Invalid JSON.');
  }
}

async function profile(req, res) {
  return (await auth.requireAccount(req)).profile_id;
}

async function getRatings(id) {
  const p = getPool();
  const r = await p.query(`SELECT r.id,r.movie_id AS "movieId",r.overall::float8,r.watched_on::text AS "watchedOn",r.spoilers,r.created_at AS "createdAt",r.question_version AS "questionVersion",json_agg(json_build_object('aspectId',a.aspect_id,'score',a.score,'skipReason',a.skip_reason,'note',a.note) ORDER BY a.aspect_id) AS answers FROM ratings r JOIN answers a ON a.rating_id=r.id WHERE r.profile_id=$1 GROUP BY r.id ORDER BY r.created_at DESC`, [id]);
  return r.rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), craft: craftScore(r.answers) }));
}

async function populationPrior(){if(populationMemo&&populationMemo.until>Date.now())return populationMemo.value;const generation=populationGeneration;const r=await getPool().query(`WITH latest AS(SELECT DISTINCT ON(r.profile_id,r.movie_id) r.id,r.profile_id,r.movie_id,r.overall,r.created_at FROM ratings r JOIN profiles p ON p.id=r.profile_id WHERE p.contribute=true ORDER BY r.profile_id,r.movie_id,r.created_at DESC) SELECT l.profile_id,l.movie_id AS "movieId",l.overall::float8,l.created_at AS "createdAt",json_agg(json_build_object('aspectId',a.aspect_id,'score',a.score)) AS answers FROM latest l JOIN answers a ON a.rating_id=l.id GROUP BY l.id,l.profile_id,l.movie_id,l.overall,l.created_at`);const groups=new Map();for(const row of r.rows){row.createdAt=row.createdAt.toISOString();if(!groups.has(row.profile_id))groups.set(row.profile_id,[]);groups.get(row.profile_id).push(row);}const value=fitPopulationPrior([...groups.values()]);if(generation===populationGeneration)populationMemo={until:Date.now()+60000,value};return value;}
const limiter = new Map();

export async function handleRequest(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isProd) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; style-src 'self'; style-src-attr 'unsafe-inline'; script-src 'self'; connect-src 'self' https:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");

  try {
    const url = new URL(req.url, 'http://localhost');
    if(['GET','HEAD'].includes(req.method)&&/^\/assets\/optimized\/[a-z-]+-\d+\.[a-f0-9]{12}\.webp$/.test(url.pathname)){return await serveStatic(req,res,path.join(root,'public',url.pathname),'.webp');}
    await ensureInit();
    if(req.method!=='GET'&&url.pathname.startsWith('/api/')&&url.pathname!=='/api/discover'&&!url.pathname.startsWith('/api/social/'))res.once('finish',()=>{populationGeneration++;populationMemo=null;recommender.invalidate();});
    const p = getPool();

    if (url.pathname.startsWith('/api/')) {
      if (!['GET', 'POST', 'DELETE', 'PATCH'].includes(req.method)) return send(res, 405, { error: 'Method not allowed.' });
      if (await auth.handle(req, res, url)) return;
      if (req.method !== 'GET') {
        await auth.assertMutation(req);
        const origin = req.headers.origin;
        const host=req.headers.host;
        const proto = req.headers['x-forwarded-proto'] || 'http';
        const rawExpected = process.env.APP_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${proto}://${host}`);
        let expected = rawExpected;
        try { expected = new URL(rawExpected).origin; } catch {}
        if (isProd && !process.env.APP_ORIGIN && !process.env.VERCEL_URL) return send(res, 503, { error: 'Set APP_ORIGIN before deploying.' });
        if (origin && origin !== expected && origin !== `https://${host}` && origin !== `http://${host}`) return send(res, 403, { error: 'Cross-origin request blocked.' });
        if (req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { error: 'Cross-site request blocked.' });
        if (req.method !== 'DELETE' && !req.headers['content-type']?.startsWith('application/json')) return send(res, 415, { error: 'Send application/json.' });
      }

      if (await social.handle(req,res,url)) return;

      if (url.pathname === '/api/health') {
        await p.query('SELECT 1');
        return send(res, 200, { status: 'ok', storage: 'postgresql' });
      }

      if (url.pathname === '/api/poster' && req.method === 'GET') {
        const movieId = url.searchParams.get('id');
        const tmdbId = url.searchParams.get('tmdbId');
        if (!movieId && !tmdbId) return send(res, 400, { error: 'Provide id or tmdbId.' });

        if (movieId) {
          const existing = await p.query('SELECT poster FROM movies WHERE id=$1', [movieId]);
          if (existing.rows[0]?.poster) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=86400, s-maxage=86400'});res.end(JSON.stringify({poster:existing.rows[0].poster}));return;
          }
        }

        let posterUrl = '';
        if (tmdbId) {
          if (process.env.TMDB_API_KEY) {
            try {
              for (const type of ['movie', 'tv']) {
                const r = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`, { signal: AbortSignal.timeout(4000) });
                if (r.ok) {
                  const d = await r.json();
                  if (d.poster_path) {
                    posterUrl = `https://image.tmdb.org/t/p/w500${d.poster_path}`;
                    break;
                  }
                }
              }
            } catch {}
          }
        }

        const titleParam = url.searchParams.get('title');
        const yearParam = url.searchParams.get('year');
        if (!posterUrl && (movieId || titleParam)) {
          let title = titleParam;
          let year = yearParam || '';
          if (movieId) {
            const row = (await p.query('SELECT title, year FROM movies WHERE id=$1', [movieId])).rows[0];
            if (row?.title) {
              title = row.title;
              year = row.year || year;
            }
          }
          if (title) {
            try {
              const cleanTitle = title.replace(/\s*\(.*\)/, '').trim();
              const searchQueries = [
                cleanTitle + (year ? ' ' + year : ''),
                cleanTitle + ' film',
                cleanTitle + ' TV series'
              ];
              for (const q of searchQueries) {
                if (posterUrl) break;
                const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json`;
                const sr = await fetch(searchUrl, { headers: { 'User-Agent': 'AfterframeApp/1.0 (contact: admin@afterframe.app)' }, signal: AbortSignal.timeout(4000) });
                if (sr.ok) {
                  const sdata = await sr.json();
                  const hits = (sdata.query?.search || []).filter(h => {
                    const t = (h.title || '').toLowerCase();
                    return !t.includes('(soundtrack') && !t.includes('(score') && !t.includes('soundtrack)') && !t.includes('album');
                  });
                  for (const item of hits.slice(0, 3)) {
                    const pageTitle = item.title;
                    if (!pageTitle) continue;
                    // First try page summary
                    const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
                    const sumRes = await fetch(sumUrl, { headers: { 'User-Agent': 'AfterframeApp/1.0 (contact: admin@afterframe.app)' }, signal: AbortSignal.timeout(4000) });
                    if (sumRes.ok) {
                      const sumData = await sumRes.json();
                      const h = sumData.thumbnail?.height;
                      const w = sumData.thumbnail?.width;
                      if (sumData.thumbnail?.source && (!h || !w || (h / w >= 1.15))) {
                        posterUrl = sumData.thumbnail.source;
                        break;
                      }
                    }
                    // Next try page HTML infobox image
                    try {
                      const artRes = await fetch(`https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
                        signal: AbortSignal.timeout(4000)
                      });
                      if (artRes.ok) {
                        const html = await artRes.text();
                        const m = html.match(/class="[^"]*infobox-image[^"]*"[^>]*>.*?<img[^>]+src="([^"]+)"/s) ||
                                  html.match(/<table class="infobox[^>]*>.*?<img[^>]+src="([^"]+)"/s);
                        if (m) {
                          let u = m[1];
                          if (u.startsWith('//')) u = 'https:' + u;
                          posterUrl = u;
                          break;
                        }
                      }
                    } catch {}
                  }
                }
              }
            } catch {}
          }
        }

        if (posterUrl && movieId) {
          await p.query('UPDATE movies SET poster=$1 WHERE id=$2', [posterUrl, movieId]).catch(() => {});
        }

        if (!posterUrl) return send(res, 404, { error: 'Poster not found.' });
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=86400, s-maxage=86400'});res.end(JSON.stringify({poster:posterUrl}));recommender.invalidate();return;
      }

      const id = await profile(req, res);
      if (req.method !== 'GET') {
        if(url.pathname!=='/api/discover'){populationGeneration++;populationMemo=null;recommender.invalidate();}
        const now = Date.now();
        const entry = limiter.get(id) || { t: now, n: 0 };
        if (now - entry.t > 60000) { entry.t = now; entry.n = 0; }
        entry.n++;
        limiter.set(id, entry);
        if (entry.n > 60) return send(res, 429, { error: 'Please wait a moment before trying again.' });
      }

      if(req.method==='POST'&&url.pathname==='/api/discover')return send(res,200,await discovery.run(req,id,await body(req)));
      if (req.method === 'GET' && url.pathname === '/api/state') {
        const [movies, ratings, watchlist, pr] = await Promise.all([
          recommender.films().then(f=>({rows:f.movies})),
          getRatings(id),
          p.query('SELECT movie_id FROM watchlist WHERE profile_id=$1', [id]),
          p.query('SELECT contribute FROM profiles WHERE id=$1', [id])
        ]);
        return send(res, 200, {
          storage: 'postgresql',
          profileKey: id,
          movies: movies.rows,
          ratings,
          catalogue: catalogueMeta,
          languageAssistanceConfigured:discovery.configured,
          watchlist: watchlist.rows.map(r => r.movie_id),
          contribute: pr.rows[0].contribute
        });
      }

      if (req.method === 'GET' && url.pathname === '/api/movies') {
        const q = (url.searchParams.get('q') || '').slice(0, 200);
        const genre = (url.searchParams.get('genre') || '').slice(0, 80);
        const limit = Math.min(60, Math.max(1, Math.floor(Number(url.searchParams.get('limit'))) || 24));
        const offset = Math.max(0, Math.min(100000, Math.floor(Number(url.searchParams.get('offset'))) || 0));
        const pattern = '%' + q.replace(/[\\%_]/g, '\\$&') + '%';
        const conditions = ` WHERE ($1=%% OR title ILIKE $1 OR original_title ILIKE $1 OR director ILIKE $1 OR year::text ILIKE $1) AND ($2= OR genres ? $2)`;
        const count = await p.query('SELECT count(*)::integer AS total FROM movies' + conditions, [pattern, genre]);
        const found = await p.query(movieSelect + conditions + ' ORDER BY rating_count DESC,title LIMIT $3 OFFSET $4', [pattern, genre, limit, offset]);
        return send(res, 200, { movies: found.rows, total: count.rows[0].total, limit, offset });
      }

      if (req.method === 'POST' && url.pathname === '/api/ratings') {
        const b = await body(req);
        const films = await p.query('SELECT id FROM movies WHERE id=$1', [b.movieId]);
        validateRating(b, new Set(films.rows.map(r => r.id)));
        if (b.entryId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.entryId)) throw Error('Invalid entry ID.');
        if (b.entryId) {
          const existingById = await p.query('SELECT profile_id, movie_id FROM ratings WHERE id=$1', [b.entryId]);
          if (existingById.rowCount) {
            if (existingById.rows[0].profile_id !== id) return send(res, 409, { error: 'This entry ID is already in use.' });
            if (existingById.rows[0].movie_id !== b.movieId) return send(res, 409, { error: 'This entry ID belongs to a different movie.' });
          }
        }
        const existingByMovie = await p.query('SELECT id FROM ratings WHERE profile_id=$1 AND movie_id=$2', [id, b.movieId]);
        const isUpdate = existingByMovie.rowCount > 0;
        const targetRid = isUpdate ? existingByMovie.rows[0].id : (b.entryId || randomUUID());
        const c = await p.connect();
        try {
          await c.query('BEGIN');
          if (isUpdate) {
            await c.query('UPDATE ratings SET overall=$1, watched_on=$2, spoilers=$3, created_at=now() WHERE id=$4 AND profile_id=$5', [b.overall, b.watchedOn, b.spoilers, targetRid, id]);
            await c.query('DELETE FROM answers WHERE rating_id=$1', [targetRid]);
            for (const a of b.answers) await c.query('INSERT INTO answers(rating_id,question_version,aspect_id,score,skip_reason,note) VALUES($1,1,$2,$3,$4,$5)', [targetRid, a.aspectId, a.score, a.skipReason || null, a.note]);
          } else {
            await c.query('INSERT INTO ratings(id,profile_id,movie_id,overall,watched_on,spoilers) VALUES($1,$2,$3,$4,$5,$6)', [targetRid, id, b.movieId, b.overall, b.watchedOn, b.spoilers]);
            for (const a of b.answers) await c.query('INSERT INTO answers(rating_id,question_version,aspect_id,score,skip_reason,note) VALUES($1,1,$2,$3,$4,$5)', [targetRid, a.aspectId, a.score, a.skipReason || null, a.note]);
          }
          await c.query('DELETE FROM watchlist WHERE profile_id=$1 AND movie_id=$2', [id, b.movieId]);
          await recommender.touch(id,c);
          await c.query('COMMIT');
        } catch (e) {
          await c.query('ROLLBACK');
          throw e;
        } finally {
          c.release();
        }
        return send(res, isUpdate ? 200 : 201, { id: targetRid, updated: isUpdate });
      }

      if (req.method === 'DELETE' && url.pathname.startsWith('/api/ratings/')) {
        const rid = url.pathname.split('/').pop();
        if (!/^[\da-f-]{36}$/.test(rid)) return send(res, 400, { error: 'Invalid rating ID.' });
        const r = await p.query('DELETE FROM ratings WHERE id=$1 AND profile_id=$2 RETURNING id', [rid, id]);
        if(r.rowCount)await recommender.touch(id);
        return send(res, r.rowCount ? 200 : 404, r.rowCount ? { ok: true } : { error: 'Rating not found.' });
      }

      if (req.method === 'POST' && url.pathname === '/api/movies') {
        const b = await body(req);
        if (typeof b.title !== 'string' || !b.title.trim() || b.title.length > 160 || !Number.isInteger(b.year) || b.year < 1888 || b.year > 2200 || typeof b.director !== 'string' || b.director.length > 160) throw Error('Enter a title, valid year and director (optional).');
        const existing = await p.query('SELECT id FROM movies WHERE lower(title)=lower($1) AND year=$2', [b.title.trim(), b.year]);
        if (existing.rowCount) return send(res, 200, { id: existing.rows[0].id });
        const mid = randomUUID();
        await p.query('INSERT INTO movies(id,title,year,director) VALUES($1,$2,$3,$4)', [mid, b.title.trim(), b.year, b.director.trim()]);
        return send(res, 201, { id: mid });
      }

      if (req.method === 'POST' && url.pathname === '/api/watchlist') {
        const b = await body(req);
        if (typeof b.saved !== 'boolean') throw Error('Saved must be true or false.');
        const m = await p.query('SELECT id FROM movies WHERE id=$1', [b.movieId]);
        if (!m.rowCount) throw Error('Film not found.');
        if (b.saved) await p.query('INSERT INTO watchlist(profile_id,movie_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [id, b.movieId]);
        else await p.query('DELETE FROM watchlist WHERE profile_id=$1 AND movie_id=$2', [id, b.movieId]);
        await recommender.touch(id);
        return send(res, 200, { ok: true });
      }

      if (req.method === 'PATCH' && url.pathname === '/api/settings') {
        const b = await body(req);
        if (typeof b.contribute !== 'boolean') throw Error('Contribution must be true or false.');
        await p.query('UPDATE profiles SET contribute=$1 WHERE id=$2', [b.contribute, id]);
        return send(res, 200, { ok: true });
      }

      if(req.method==='POST'&&url.pathname==='/api/recommendations/refresh'){
        const b=await body(req);if(!b||typeof b!=='object'||Array.isArray(b)||Object.keys(b).length)return send(res,400,{error:'Send an empty object.'});
        await auth.limits(req,'recommendation_refresh',id,90,30,900);
        return send(res,200,await recommender.refresh(id));
      }
      if(req.method==='POST'&&url.pathname==='/api/recommendations/feedback'){
        const b=await body(req);
        if(!b||Array.isArray(b)||Object.keys(b).some(k=>!['movieId','dismissed'].includes(k))||typeof b.movieId!=='string'||b.movieId.length>100||typeof b.dismissed!=='boolean')return send(res,400,{error:'Choose a movie and a true/false dismissal.'});
        if(!(await p.query('SELECT id FROM movies WHERE id=$1',[b.movieId])).rowCount)return send(res,404,{error:'Movie unavailable.'});
        await auth.limits(req,'recommendation_feedback',id,180,90,900);
        return send(res,200,await recommender.feedback(id,b.movieId,b.dismissed));
      }
      if(req.method==='GET'&&url.pathname==='/api/recommendations/hidden'){
        const raw=url.searchParams.get('offset')||'0';if(!/^\d{1,5}$/.test(raw)||Number(raw)>10000)return send(res,400,{error:'Invalid page offset.'});
        const r=await p.query('SELECT m.id,m.title,m.year FROM recommendation_feedback f JOIN movies m ON m.id=f.movie_id WHERE f.profile_id=$1 ORDER BY f.created_at DESC,f.movie_id LIMIT 21 OFFSET $2',[id,Number(raw)]);
        return send(res,200,{movies:r.rows.slice(0,20),nextOffset:r.rows.length>20?Number(raw)+20:null});
      }

      if(req.method==='GET'&&url.pathname==='/api/taste'){const t=await recommender.profile(id);return send(res,200,{...t.public,catalogue:catalogueMeta});}

      if (req.method === 'GET' && url.pathname === '/api/export') {
        const acct = await auth.requireAccount(req);
        return send(res, 200, {
          schemaVersion: 2,
          questionVersion: 1,
          account: { email: acct.email, displayName: acct.display_name, username: acct.username, bio: acct.bio },
          exportedAt: new Date().toISOString(),
          ratings: await getRatings(id),
          watchlist: (await p.query('SELECT movie_id FROM watchlist WHERE profile_id=$1', [id])).rows.map(r => r.movie_id),
          movies: (await p.query(movieSelect)).rows
        });
      }

      if (req.method === 'DELETE' && url.pathname === '/api/profile') {
        return send(res, 409, { error: 'Delete your account through Profile with your current password.', code: 'REAUTH_REQUIRED' });
      }

      return send(res, 404, { error: 'Endpoint not found.' });
    }

    if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed.' });
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/' || rel === '/landing') rel = '/landing.html';
    if (['/app', '/app/', '/index.html'].includes(rel)) {
      if (!await auth.getSession(req)) {
        res.writeHead(302, { Location: '/landing.html?next=%2Fapp', 'Cache-Control': 'no-store' });
        res.end();
        return;
      }
      rel = '/index.html';
    }
    const full = path.resolve(root, 'public', '.' + rel);
    if (!full.startsWith(path.join(root, 'public') + path.sep)) return send(res, 403, { error: 'Forbidden.' });
    const ext = path.extname(full);
    await serveStatic(req,res,full,ext);
  } catch (e) {
    if (e instanceof AuthError) return send(res, e.status, { error: e.message, code: e.code });
    const status = e.code === 'ENOENT' ? 404 : e.status || 400;
    if (!e.code && !e.status) console.error(e.message);
    if (e.code && e.code !== 'ENOENT') return send(res, 500, { error: 'Storage could not complete this request. Your answers have not been marked as saved.' });
    send(res, status, { error: e.code === 'ENOENT' ? 'Not found.' : e.message });
  }
}

export const server = http.createServer(handleRequest);
export default handleRequest;

server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.keepAliveTimeout = 5000;
server.maxHeadersCount = 64;

if (process.argv[1] && (process.argv[1].endsWith('server.mjs') || process.argv[1].endsWith('server.js'))) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port, process.env.HOST || (isProd ? '0.0.0.0' : '127.0.0.1'), () => console.log(`Afterframe listening on ${port} · PostgreSQL connected`));
  const cleanup = setInterval(() => {
    for (const [id, e] of limiter) if (Date.now() - e.t > 120000) limiter.delete(id);
    if (pool) pool.query('DELETE FROM sessions WHERE expires_at<now()').catch(() => {});
  }, 600000);
  cleanup.unref();
  async function shutdown() {
    if (auth) auth.close();
    clearInterval(cleanup);
    server.close();
    if (pool) await pool.end();
    process.exit(0);
  }
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
