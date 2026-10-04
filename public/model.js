export const aspectIds=['story','characters','performance','visuals','sound','editing','ideas','impact'];
export const modelAspectIds=aspectIds.slice(0,7); // Impact is an outcome, not a craft preference predictor.
export function validateRating(b,movieIds){
 if(!b || !movieIds.has(b.movieId)) throw Error('Choose an existing film.');
 if(!Number.isFinite(b.overall)||b.overall<0.5||b.overall>5||!Number.isInteger(b.overall*2)) throw Error('Overall rating must be 0.5–5 in half-star steps.');
 if(typeof b.watchedOn!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(b.watchedOn)||Number.isNaN(Date.parse(b.watchedOn))||new Date(b.watchedOn).toISOString().slice(0,10)!==b.watchedOn) throw Error('Choose a valid viewing date.');
 if(!Array.isArray(b.answers)||b.answers.length!==8)throw Error('Answer or explicitly skip all eight aspects.');
 const seen=new Set();let answered=0;
 for(const a of b.answers){
  if(!aspectIds.includes(a.aspectId)||seen.has(a.aspectId))throw Error('Each aspect must appear exactly once.');seen.add(a.aspectId);
  if(a.score!==null&&(!Number.isInteger(a.score)||a.score<0||a.score>4))throw Error('Aspect scores must be 0–4 or null.');
  if(a.score!==null)answered++;
  if(a.score===null&&!['not_applicable','unsure'].includes(a.skipReason))throw Error('Skipped aspects need a reason.');
  if(a.score!==null&&a.skipReason!=null)throw Error('Scored aspects cannot have a skip reason.');
  if(typeof a.note!=='string'||a.note.length>1500)throw Error('Each note must be text under 1,500 characters.');
 }
 if(answered<4)throw Error('Score at least four aspects for a meaningful profile.');
 if(typeof b.spoilers!=='boolean')throw Error('Spoiler flag must be true or false.');
 return b;
}
export function craftScore(answers){const a=answers.filter(x=>x.score!==null);return a.length?1.25*a.reduce((s,x)=>s+x.score,0)/a.length:null;}
export function latestDistinct(ratings){const seen=new Set();return [...ratings].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).filter(r=>{if(seen.has(r.movieId))return false;seen.add(r.movieId);return true;});}
export function fitTaste(ratings){
 const distinct=latestDistinct(ratings);const rows=distinct.filter(r=>modelAspectIds.every(id=>r.answers.some(a=>a.aspectId===id&&a.score!==null)));
 const n=rows.length;const averages=aspectIds.map(id=>{const a=distinct.flatMap(r=>r.answers).filter(a=>a.aspectId===id&&a.score!==null);return {id,value:a.length?a.reduce((s,x)=>s+x.score,0)/a.length:null,n:a.length};});
 const base={n,distinct:distinct.length,required:12,averages,weights:null,ready:false,reason:'Log 12 different films with all seven craft aspects scored to start learning. Personal impact is excluded to avoid simply predicting enjoyment from enjoyment.'};
 if(n<12)return base;
 const X=rows.map(r=>modelAspectIds.map(id=>r.answers.find(a=>a.aspectId===id).score));const y=rows.map(r=>r.overall);
 if(Math.max(...y)-Math.min(...y)<1)return {...base,reason:'More varied overall ratings are needed; there is not yet enough contrast to estimate preferences.'};
 const means=modelAspectIds.map((_,j)=>X.reduce((s,x)=>s+x[j],0)/n);const ym=y.reduce((s,x)=>s+x,0)/n;
 const centered=X.map(x=>x.map((v,j)=>v-means[j]));const weights=Array(7).fill(0.1);const lambda=0.65;
 for(let k=0;k<1800;k++){const gradients=Array(7).fill(0);for(let i=0;i<n;i++){const error=centered[i].reduce((s,v,j)=>s+v*weights[j],0)-(y[i]-ym);for(let j=0;j<7;j++)gradients[j]+=error*centered[i][j]/n;}for(let j=0;j<7;j++)weights[j]=Math.max(0,weights[j]-0.035*(gradients[j]+lambda*weights[j]));}
 const sum=weights.reduce((s,v)=>s+v,0);if(sum<0.03)return {...base,reason:'Your ratings do not yet reveal a stable positive craft preference. Keep logging varied films.'};
 return {...base,ready:true,weights:modelAspectIds.map((id,j)=>({id,weight:weights[j]/sum,coefficient:weights[j]})),intercept:ym-weights.reduce((s,v,j)=>s+v*means[j],0),reason:'Experimental, regularised associations—not causal explanations. More varied ratings improve the estimate.'};
}
