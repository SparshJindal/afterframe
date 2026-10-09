import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRecommender,journalFingerprint} from '../server/recommendations.mjs';
function mockPool(movies) {
 const shelves=new Map();let filmCalls=0;
 function state(id){if(!shelves.has(id))shelves.set(id,{journal_key:'',input_revision:0,refresh_revision:0,served_revision:-1,movie_ids:[],recent_slates:[],saved:[],hidden:[]});return shelves.get(id);}
 return {state,get filmCalls(){return filmCalls;},async query(sql,p=[]){
  if(sql==='movies'){filmCalls++;await new Promise(r=>setTimeout(r,5));return {rows:movies};}
  if(sql.startsWith('SELECT s.*'))return {rows:[structuredClone(state(p[0]))]};
  if(sql.startsWith('UPDATE recommendation_shelves SET journal_key')){Object.assign(state(p[0]),{journal_key:p[1],served_revision:p[2],movie_ids:p[3],recent_slates:JSON.parse(p[4])});return {rows:[]};}
  if(sql.includes('input_revision=recommendation_shelves.input_revision+1')){state(p[0]).input_revision++;return {rows:[]};}
  throw Error('Unexpected mock SQL: '+sql);
 }};
}
const movies=Array.from({length:20},(_,i)=>({id:'m'+i,title:'Film '+i,genres:[i<10?'Drama':'Comedy'],ratingMean:4,ratingCount:40}));
const root=fileURLToPath(new URL('../',import.meta.url));
const prior=async()=>({coefficients:Array(7).fill(.12),source:'conservative-default'});
test('concurrent recommendation reads share model/catalogue work; revisions invalidate cache',async()=>{let reads=0;const pool=mockPool(movies);const rec=await createRecommender({pool,root,movieSelect:'movies',getRatings:async()=>{reads++;return []},populationPrior:prior});const [a,b]=await Promise.all([rec.profile('owner'),rec.profile('owner')]);assert.equal(pool.filmCalls,1);assert.equal(reads,1);assert.deepEqual(a.public,b.public);await rec.profile('owner');assert.equal(reads,1);rec.invalidate();await rec.profile('owner');assert.equal(pool.filmCalls,2);assert.equal(reads,2);});
test('a movie log invalidates a warm cache in a different worker immediately',async()=>{const pool=mockPool(movies);let ratings=[{movieId:'m0',overall:5,createdAt:'2026-01-01',answers:[]}];const args={pool,root,movieSelect:'movies',getRatings:async()=>structuredClone(ratings),populationPrior:prior};const first=await createRecommender(args),second=await createRecommender(args);const before=(await second.profile('owner')).public.hybridRecommendations.map(r=>r.movieId);ratings.push({movieId:'m10',overall:5,createdAt:'2026-01-02',answers:[]});await first.touch('owner');const after=(await second.profile('owner')).public.hybridRecommendations;assert.notDeepEqual(after.map(r=>r.movieId),before);assert.equal(after.some(r=>r.movieId==='m10'),false);assert.ok(after.some(r=>r.sourceMovieId==='m10'));});
test('fingerprints change for score/aspect edits, not array order or private note content',()=>{const a={movieId:'m0',overall:4,createdAt:'2026-01-01',answers:[{aspectId:'story',score:3,note:'private'}]},b={movieId:'m1',overall:2,createdAt:'2026-01-02',answers:[]};assert.equal(journalFingerprint([a,b]),journalFingerprint([b,a]));assert.equal(journalFingerprint([a]),journalFingerprint([{...a,answers:[{aspectId:'story',score:3,note:'different private text'}]}]));assert.notEqual(journalFingerprint([a]),journalFingerprint([{...a,overall:5}]));assert.notEqual(journalFingerprint([a]),journalFingerprint([{...a,answers:[{aspectId:'story',score:4}]}]));});
test('a newly logged custom movie reloads another worker\'s warm catalogue index',async()=>{const catalogue=structuredClone(movies),pool=mockPool(catalogue);let own=[{movieId:'m0',overall:5,createdAt:'2026-01-01',answers:[]}];const args={pool,root,movieSelect:'movies',getRatings:async()=>structuredClone(own),populationPrior:prior};const worker=await createRecommender(args);await worker.profile('owner');assert.equal(pool.filmCalls,1);catalogue.push({id:'brand-new',title:'New film',genres:['Comedy'],ratingCount:40,ratingMean:4});own.push({movieId:'brand-new',overall:5,createdAt:'2026-01-02',answers:[]});pool.state('owner').input_revision++;const p=await worker.profile('owner');assert.equal(pool.filmCalls,2);assert.ok(p.public.hybridRecommendations.some(r=>r.sourceMovieId==='brand-new'));assert.equal(p.public.hybridRecommendations.some(r=>r.movieId==='brand-new'),false);});
