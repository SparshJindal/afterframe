import fs from 'node:fs/promises';
import path from 'node:path';
import { catalogueMeta } from './source.mjs';

export async function importCatalogue(pool, root = process.cwd()) {
  const meta = catalogueMeta;
  try {
    const prior = await pool.query('SELECT source_version FROM catalogue_imports WHERE source=$1', [meta.source]);
    if (prior.rows[0]?.source_version === meta.version) return meta;

    let moviesRaw = null;
    const candidates = [
      path.join(root, 'catalogue/movies.json'),
      path.resolve(process.cwd(), 'catalogue/movies.json'),
      '/var/task/catalogue/movies.json'
    ];
    for (const p of candidates) {
      try {
        moviesRaw = await fs.readFile(p, 'utf8');
        break;
      } catch {}
    }

    if (!moviesRaw) {
      console.warn('catalogue/movies.json not found in serverless environment; skipping bulk MovieLens import.');
      return meta;
    }

    const movies = JSON.parse(moviesRaw);
    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      for (let i = 0; i < movies.length; i += 500) {
        await c.query(`INSERT INTO movies(id,title,year,director,genres,runtime,poster,original_title,movielens_id,imdb_id,tmdb_id,tags,rating_count,rating_mean,source)
        SELECT id,title,year,coalesce(m.director, ''),genres,m.runtime,coalesce(m.poster, ''),"originalTitle","movielensId","imdbId","tmdbId",tags,"ratingCount","ratingMean",source FROM jsonb_to_recordset($1::jsonb) AS m(id text,title text,year integer,director text,genres jsonb,runtime integer,poster text,"originalTitle" text,"movielensId" integer,"imdbId" text,"tmdbId" integer,tags jsonb,"ratingCount" integer,"ratingMean" numeric,source text)
        ON CONFLICT(id) DO UPDATE SET original_title=excluded.original_title,movielens_id=excluded.movielens_id,imdb_id=excluded.imdb_id,tmdb_id=excluded.tmdb_id,tags=excluded.tags,rating_count=excluded.rating_count,rating_mean=excluded.rating_mean,genres=excluded.genres,source=excluded.source,director=CASE WHEN excluded.director <> '' THEN excluded.director ELSE movies.director END,poster=CASE WHEN excluded.poster <> '' THEN excluded.poster ELSE movies.poster END`, [JSON.stringify(movies.slice(i, i + 500))]);
      }
      await c.query(`INSERT INTO catalogue_imports(source,source_version,metadata) VALUES($1,$2,$3) ON CONFLICT(source) DO UPDATE SET source_version=excluded.source_version,metadata=excluded.metadata,imported_at=now()`, [meta.source, meta.version, JSON.stringify(meta)]);
      await c.query('COMMIT');
      console.log(`Catalogue: ${movies.length.toLocaleString()} MovieLens films imported; no user/aspect ratings fabricated.`);
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    console.error('Catalogue initialization warning:', e.message);
  }
  return meta;
}
export default importCatalogue;
