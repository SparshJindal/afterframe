// Catalogue metadata is evidence for relevance, never a substitute for craft scores.
export function buildFilmIndex(movies) {
  const byId = new Map(movies.map(m => [m.id, m]));
  const gdf = new Map(), tdf = new Map();
  for (const m of movies) {
    for (const g of new Set(m.genres || [])) gdf.set(g, (gdf.get(g) || 0) + 1);
    for (const t of new Set(m.tags || [])) tdf.set(t, (tdf.get(t) || 0) + 1);
  }
  const n = Math.max(1, movies.length);
  const idf = (df, k) => 1 + Math.log((n + 1) / ((df.get(k) || 0) + 1));
  function vector(values, df) {
    const weights = new Map([...new Set(values || [])].map(k => [k, idf(df, k)]));
    return { weights, norm: Math.sqrt([...weights.values()].reduce((s, w) => s + w, 0)) };
  }
  const vectors = new Map(movies.map(m => [m.id, { genres: vector(m.genres, gdf), tags: vector(m.tags, tdf) }]));
  function overlap(a, b, key) {
    const av = vectors.get(a.id)?.[key] || vector(a[key], key === 'genres' ? gdf : tdf);
    const bv = vectors.get(b.id)?.[key] || vector(b[key], key === 'genres' ? gdf : tdf);
    if (!av.norm || !bv.norm) return 0;
    const [small, large] = av.weights.size < bv.weights.size ? [av.weights, bv.weights] : [bv.weights, av.weights];
    let shared = 0;
    for (const [k, w] of small) if (large.has(k)) shared += w;
    return shared / (av.norm * bv.norm);
  }
  const similarity = (a, b) => {
    const genre = overlap(a, b, 'genres'), tags = overlap(a, b, 'tags');
    const director = a.director && b.director && a.director.toLowerCase() === b.director.toLowerCase() ? 1 : 0;
    // Redistribute missing-feature weight, rather than inventing tags/directors.
    const hasTags = a.tags?.length && b.tags?.length;
    const hasDirectors = !!(a.director && b.director);
    const weight = .55 + (hasTags ? .35 : 0) + (hasDirectors ? .10 : 0);
    return (.55 * genre + (hasTags ? .35 * tags : 0) + (hasDirectors ? .10 * director : 0)) / weight;
  };
  return { movies, byId, similarity };
}

// Recency is by log order, not wall time: an unchanged journal remains reproducible.
// Half the influence follows the newest log, a quarter follows the recent queue,
// and a quarter preserves long-term taste. Rating strength still matters.
export function viewingSignals(ratings) {
  const latest = new Map();
  for (const r of [...ratings].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')) || String(b.id || '').localeCompare(String(a.id || '')))) {
    if (!latest.has(r.movieId)) latest.set(r.movieId, r);
  }
  const own = [...latest.values()].slice(0,200), recent = own.map((_, i) => Math.exp(-i / 3));
  const total = recent.reduce((s, v) => s + v, 0) || 1;
  return own.map((r, i) => ({ ...r, influence: .25 / own.length + .25 * recent[i] / total + (i === 0 ? .5 : 0), signal: Math.max(-1, Math.min(1, (r.overall - 3) / 2)) }));
}

export function communityQuality(m) {
  const count = Math.max(0, m.ratingCount || 0);
  return (((m.ratingMean ?? 3.5) * count + 3.5 * 20) / (count + 20) - .5) / 4.5;
}

export function metadataAffinity(index, m, signals) {
  let positive = 0, negative = 0, mass = 0, negativeMass = 0, best = null, bestContribution = 0;
  for (const r of signals) {
    const source = index.byId.get(r.movieId);
    if (!source || !source.genres?.length) continue;
    const sim = index.similarity(m, source), strength = Math.abs(r.signal) * r.influence;
    if (r.signal > 0) {
      positive += sim * strength; mass += strength;
      if (sim * strength > bestContribution) { bestContribution = sim * strength; best = r; }
    } else if (r.signal < 0) { negative += sim * strength; negativeMass += r.influence; }
  }
  // Negative signals retain weight even after a long history of positive logs.
  return { positive: positive / (mass || 1), negative: negative / (negativeMass || 1), best,
    positiveMass: mass, negativeMass, sharedGenres: best ? (m.genres || []).filter(g => index.byId.get(best.movieId)?.genres?.includes(g)) : [] };
}

export function earlyRecommendations(index, ratings, limit = 8, { includeRank = false, diversify = true, excludeIds = new Set() } = {}) {
  if (!ratings.length) return [];
  const signals = viewingSignals(ratings), seen = new Set(ratings.map(r => r.movieId)), ranked = [];
  for (const m of index.movies) {
    if (seen.has(m.id) || excludeIds.has(m.id) || (m.ratingCount || 0) < 5 || m.ratingMean == null) continue;
    const a = metadataAffinity(index, m, signals), quality = communityQuality(m);
    if (a.positiveMass && a.positive < .08) continue;
    const rank = (a.positiveMass ? .78 * a.positive : 0) + .22 * quality - .6 * a.negative;
    const source = a.best && a.positive >= .08 ? index.byId.get(a.best.movieId) : null;
    ranked.push({ movieId: m.id, rank, kind: source ? 'content' : 'discovery', sourceMovieId: source?.id || null,
      sharedGenres: a.sharedGenres, communityRating: m.ratingMean, communityCount: m.ratingCount,
      reason: source ? `Because you rated ${source.title} ${a.best.overall}/5.${a.sharedGenres.length ? ' Shared genres: ' + a.sharedGenres.join(' · ') + '.' : ' Related catalogue metadata.'}` : 'Community-backed discovery, with matches to lower-rated films down-weighted.' });
  }
  ranked.sort((a, b) => b.rank - a.rank || b.communityCount - a.communityCount || a.movieId.localeCompare(b.movieId));
  if (!diversify) return ranked.slice(0, limit).map(({ rank, ...r }) => includeRank ? { ...r, rank } : r);
  const pool = ranked.slice(0, 500), chosen = [];
  while (pool.length && chosen.length < limit) {
    let at = 0, best = -Infinity;
    for (let i = 0; i < pool.length; i++) {
      const m = index.byId.get(pool[i].movieId), redundancy = chosen.reduce((v, r) => Math.max(v, index.similarity(m, index.byId.get(r.movieId))), 0);
      const value = pool[i].rank - .16 * redundancy;
      if (value > best) { best = value; at = i; }
    }
    chosen.push(pool.splice(at, 1)[0]);
  }
  return chosen.map(({ rank, ...r }) => includeRank ? { ...r, rank } : r);
}
