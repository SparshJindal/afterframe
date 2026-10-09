import { viewingSignals, metadataAffinity, communityQuality } from '../public/recommend.js';
import { modelAspectIds } from '../public/model.js';

// Stable tie-breaking only. This is not a substitute for personal relevance.
function tieNoise(seed, id) {
  let hash = 2166136261;
  for (const c of seed + ':' + id) hash = Math.imul(hash ^ c.charCodeAt(0), 16777619);
  return (hash >>> 0) / 4294967295;
}
const franchise = title => String(title || '').toLowerCase().replace(/\([^)]*\)/g, '').split(/[:–—]|\b(?:part|chapter)\b/)[0].replace(/\b(?:the|a|an|\d+|ii|iii|iv|v)\b/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export function rankHybrid(index, ratings, {
  neighbors = {}, taste = null, aspects = [], limit = 8, discovery = false, candidateIds = null,
  excludeIds = new Set(), previousIds = [], recentSlates = [], seed = '', maxRepeats = 5,
  preferredIds = null, includeRank = false
} = {}) {
  const own = viewingSignals(ratings), seen = new Set(ratings.map(r => r.movieId));
  if (!own.length && !discovery) return [];
  const positives = own.filter(r => r.signal > 0), negatives = own.filter(r => r.signal < 0);
  const positiveMass = positives.reduce((s, r) => s + r.signal * r.influence, 0) || 1;
  const negativeMass = negatives.reduce((s, r) => s + r.influence, 0) || 1;
  const collaborative = new Map(), negative = new Map();
  for (const r of positives) for (const [id, similarity, support] of neighbors[r.movieId] || []) {
    if (support < 3 || !Number.isFinite(similarity) || similarity <= 0) continue;
    const contribution = similarity * r.signal * r.influence / positiveMass * support / (support + 5);
    const current = collaborative.get(id) || { score: 0, best: 0, support: 0, sourceMovieId: null };
    current.score += contribution;
    if (contribution > current.best) { current.best = contribution; current.sourceMovieId = r.movieId; current.support = support; }
    collaborative.set(id, current);
  }
  for (const r of negatives) for (const [id, similarity, support] of neighbors[r.movieId] || []) {
    if (support < 3 || !Number.isFinite(similarity) || similarity <= 0) continue;
    negative.set(id, (negative.get(id) || 0) + similarity * -r.signal * r.influence / negativeMass * support / (support + 5));
  }
  const aspectMap = new Map();
  for (const a of aspects) { if (!aspectMap.has(a.movieId)) aspectMap.set(a.movieId, []); aspectMap.get(a.movieId).push(a); }
  const previous = new Set(previousIds), exposure = new Map();
  for (const slate of recentSlates.slice(-3)) for (const id of new Set(slate)) exposure.set(id, (exposure.get(id) || 0) + 1);
  const ranked = [];
  for (const m of index.movies) {
    const id = m.id;
    if (seen.has(id) || excludeIds.has(id) || (candidateIds && !candidateIds.has(id))) continue;
    const a = aspectMap.get(id), hasCraft = taste?.ready && a && modelAspectIds.every(k => a.some(v => v.aspectId === k && v.sample >= 3 && Number.isFinite(v.score)));
    if (!hasCraft && ((m.ratingCount || 0) < 5 || m.ratingMean == null)) continue;
    const meta = metadataAffinity(index, m, own), cf = collaborative.get(id), negativeCf = negative.get(id) || 0;
    const positiveCf = cf?.score || 0, cfMatch = positiveCf / (positiveCf + .12), cfAvoid = negativeCf / (negativeCf + .12);
    const personal = meta.positiveMass > 0 || collaborative.size > 0;
    const quality = communityQuality(m);
    // Keep a vetted change-of-pace pool so a strong dislike can escape an old
    // genre cluster. Low-support/off-topic candidates do not qualify.
    if (personal && meta.positive < .08 && cfMatch < .08 && !hasCraft && !discovery && (quality < .72 || (m.ratingCount || 0) < 20)) continue;
    const cfWeight = collaborative.size ? .42 : 0;
    let rank = personal ? (.86 - cfWeight) * meta.positive + cfWeight * cfMatch + .14 * quality : quality;
    rank -= .95 * meta.negative + .35 * cfAvoid;
    let predicted, sample, craftBlend = 0;
    if (hasCraft) {
      sample = Math.min(...a.filter(v => modelAspectIds.includes(v.aspectId)).map(v => v.sample));
      predicted = Math.max(.5, Math.min(5, taste.intercept + taste.weights.reduce((s, w) => s + w.coefficient * a.find(v => v.aspectId === w.id).score, 0)));
      craftBlend = Math.min(.35, taste.n / (taste.n + 30) * sample / (sample + 10));
      rank = (1 - craftBlend) * rank + craftBlend * (predicted - .5) / 4.5;
    }
    const baseRank = rank;
    // Exposure penalty applies on a changed journal / explicit More picks, never on each GET.
    rank -= previous.has(id) ? .10 : 0;
    rank -= Math.min(.06, (exposure.get(id) || 0) * .02);
    if (seed) rank += .025 * tieNoise(seed, id);
    const source = cf?.sourceMovieId || meta.best?.movieId, sourceTitle = index.byId.get(source)?.title;
    const signals = [];
    if (meta.best && meta.positive >= .08) signals.push('metadata');
    if (cf) signals.push('historical-collaborative');
    if (predicted !== undefined) signals.push('craft');
    if (!signals.length) signals.push('community');
    const reason = cf ? `MovieLens viewers who liked ${sourceTitle} also liked this (${cf.support} shared positive raters).` : meta.best && meta.positive >= .08 ? `Because you rated ${sourceTitle} ${meta.best.overall}/5.${meta.sharedGenres.length ? ' Shared genres: ' + meta.sharedGenres.join(' · ') + '.' : ' Related catalogue metadata.'}` : predicted !== undefined ? 'Based on your aspect preferences and shared numeric scores.' : 'A community-backed change of pace.';
    ranked.push({ movieId: id, rank, baseRank, kind: 'hybrid', signals, reason, sourceMovieId: source || null,
      communityRating: m.ratingMean, communityCount: m.ratingCount,
      ...(predicted !== undefined ? { predicted, sample, craftBlend } : {}),
      evidence: { historicalSupport: cf?.support || 0, metadata: meta.positive >= .08, craft: predicted !== undefined } });
  }
  ranked.sort((a, b) => b.rank - a.rank || a.movieId.localeCompare(b.movieId));
  const chosen = [], byId = new Map(ranked.map(r => [r.movieId, r]));
  if (preferredIds) for (const id of preferredIds) { const r = byId.get(id); if (r && !chosen.includes(r) && chosen.length < limit) chosen.push(r); }
  const pool = ranked.filter(r => !chosen.includes(r)).slice(0, 1000);
  const freshFloor = (ranked[0]?.baseRank ?? 0) - .22;
  while (pool.length && chosen.length < limit) {
    const repeats = chosen.filter(r => previous.has(r.movieId)).length;
    const canUseFresh = repeats >= maxRepeats && pool.some(r => !previous.has(r.movieId) && r.baseRank >= freshFloor);
    let at = -1, best = -Infinity;
    for (let i = 0; i < pool.length; i++) {
      const r = pool[i];
      if (canUseFresh && previous.has(r.movieId)) continue;
      const m = index.byId.get(r.movieId);
      const redundancy = chosen.reduce((v, c) => Math.max(v, index.similarity(m, index.byId.get(c.movieId))), 0);
      const sameDirector = m.director && chosen.filter(c => index.byId.get(c.movieId)?.director === m.director).length;
      const series = franchise(m.title), sameSeries = series.length > 4 && chosen.some(c => franchise(index.byId.get(c.movieId)?.title) === series);
      const value = r.rank - .16 * redundancy - .06 * (sameDirector || 0) - (sameSeries ? .10 : 0);
      if (value > best) { best = value; at = i; }
    }
    if (at < 0) break;
    chosen.push(pool.splice(at, 1)[0]);
  }
  return chosen.map(({ rank, baseRank, ...r }) => includeRank ? { ...r, rank, baseRank } : r);
}
