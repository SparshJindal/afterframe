import {earlyRecommendations} from '../public/recommend.js';
import {latestDistinct,modelAspectIds} from '../public/model.js';
export function rankHybrid(index,ratings,{neighbors={},taste=null,aspects=[],limit=8,discovery=false,candidateIds=null}={}){
 const own=latestDistinct(ratings),seen=new Set(own.map(r=>r.movieId));if(!own.length&&!discovery)return [];
 const metadata=earlyRecommendations(index,own,500,{includeRank:true,diversify:false});const content=new Map(metadata.map(r=>[r.movieId,r]));const likes=own.filter(r=>r.overall>=3.5),dislikes=own.filter(r=>r.overall<=2.5),denom=likes.reduce((s,r)=>s+r.overall-3,0)||1;
 const collaborative=new Map();for(const r of likes){for(const [id,sim,support]of neighbors[r.movieId]||[]){if(seen.has(id))continue;const existing=collaborative.get(id)||{score:0,sourceMovieId:r.movieId,support,best:0};existing.score+=sim*(r.overall-3)/denom;if(sim>existing.best){existing.best=sim;existing.sourceMovieId=r.movieId;existing.support=support;}collaborative.set(id,existing);}}
 const negative=new Map();for(const r of dislikes)for(const [id,sim]of neighbors[r.movieId]||[])negative.set(id,Math.max(negative.get(id)||0,sim*(3-r.overall)/2.5));
 const aspectMap=new Map();for(const a of aspects){if(!aspectMap.has(a.movieId))aspectMap.set(a.movieId,[]);aspectMap.get(a.movieId).push(a);}
 const candidates=new Set([...content.keys(),...collaborative.keys(),...(taste?.ready?aspectMap.keys():[]),...(discovery?index.movies.map(m=>m.id):[])]);const ranked=[];
 for(const id of candidates){const m=index.byId.get(id);if(!m||seen.has(id)||(candidateIds&&!candidateIds.has(id)))continue;const a=aspectMap.get(id),hasCraft=taste?.ready&&a&&modelAspectIds.every(key=>a.some(v=>v.aspectId===key&&v.sample>=3));if(!hasCraft&&((m.ratingCount||0)<5||m.ratingMean==null))continue;
  const meta=content.get(id),cf=collaborative.get(id),quality=(((m.ratingMean??3.5)*(m.ratingCount||0)+3.5*20)/((m.ratingCount||0)+20)-0.5)/4.5;const contentScore=meta?.rank??0.2*quality;
  const cfScore=Math.max(0,(cf?.score||0)-(negative.get(id)||0));let rank=(contentScore+0.3*cfScore)/1.3;let predicted,sample,craftBlend=0;
  if(hasCraft){sample=Math.min(...a.map(x=>x.sample));predicted=Math.max(.5,Math.min(5,taste.intercept+taste.weights.reduce((s,w)=>s+w.coefficient*a.find(v=>v.aspectId===w.id).score,0)));craftBlend=Math.min(.35,taste.n/(taste.n+30)*sample/(sample+10));rank=(1-craftBlend)*rank+craftBlend*(predicted-.5)/4.5;}
  const source=cf?.sourceMovieId||meta?.sourceMovieId;const sourceTitle=index.byId.get(source)?.title||'a film you liked';const signals=[];if(meta?.kind==='content')signals.push('metadata');if(cf)signals.push('historical-collaborative');if(predicted!==undefined)signals.push('craft');if(!signals.length)signals.push('community');
  const reason=[cf?`Historical MovieLens viewers who liked ${sourceTitle} also liked this film (${cf.support} shared positive raters).`:meta?.reason||'Community-backed discovery; no established personal match.',predicted!==undefined?`Your experimental craft model contributes a small, evidence-weighted signal from at least ${sample} opt-in viewers per aspect.`:''].filter(Boolean).join(' ');
  ranked.push({movieId:id,rank,kind:'hybrid',signals,reason,sourceMovieId:source||null,communityRating:m.ratingMean,communityCount:m.ratingCount,...(predicted!==undefined?{predicted,sample,craftBlend}:{}),evidence:{historicalSupport:cf?.support||0,metadata:!!meta,craft:predicted!==undefined}});
 }
 ranked.sort((a,b)=>b.rank-a.rank||a.movieId.localeCompare(b.movieId));const shortlist=ranked.slice(0,500),chosen=[];
 while(shortlist.length&&chosen.length<limit){let at=0,best=-Infinity;for(let i=0;i<shortlist.length;i++){const m=index.byId.get(shortlist[i].movieId),redundancy=chosen.reduce((s,r)=>Math.max(s,index.similarity(m,index.byId.get(r.movieId))),0),value=shortlist[i].rank-.075*redundancy;if(value>best){best=value;at=i;}}chosen.push(shortlist.splice(at,1)[0]);}
 return chosen.map(({rank,...r})=>r);
}
