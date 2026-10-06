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
export const defaultPrior=Array(7).fill(0.12);
const complete=rows=>latestDistinct(rows).filter(r=>modelAspectIds.every(id=>r.answers.some(a=>a.aspectId===id&&a.score!==null)));
const vector=r=>modelAspectIds.map(id=>r.answers.find(a=>a.aspectId===id).score);
// No inverse-variance amplification. Raw 0–4 units keep tiny score noise tiny.
function solve(X,y,prior,lambda){const n=X.length,means=prior.map((_,j)=>X.reduce((s,x)=>s+x[j],0)/n),ym=y.reduce((s,v)=>s+v,0)/n;const C=X.map(x=>x.map((v,j)=>v-means[j]));const variances=means.map((m,j)=>C.reduce((s,x)=>s+x[j]**2,0)/n);const weights=[...prior];
 for(let k=0;k<900;k++){const g=Array(7).fill(0);for(let i=0;i<n;i++){const error=C[i].reduce((s,v,j)=>s+v*weights[j],0)-(y[i]-ym);for(let j=0;j<7;j++)g[j]+=error*C[i][j]/n;}for(let j=0;j<7;j++)weights[j]=variances[j]<0.15?prior[j]:Math.max(0,weights[j]-0.04*(g[j]+lambda*(weights[j]-prior[j])));}
 const intercept=ym-weights.reduce((s,v,j)=>s+v*means[j],0);const mse=X.reduce((s,x,i)=>s+(intercept+x.reduce((a,v,j)=>a+v*weights[j],0)-y[i])**2,0)/n;return {weights,intercept,mse,variances};
}
export function fitPopulationPrior(groups){const eligible=groups.map(complete).filter(rows=>rows.length>=3&&Math.max(...rows.map(r=>r.overall))-Math.min(...rows.map(r=>r.overall))>=1);const X=[],y=[];
 // Center within each user so generous raters do not become a population preference.
 for(const rows of eligible){const capped=rows.slice(0,100),xs=capped.map(vector),ys=capped.map(r=>r.overall),means=defaultPrior.map((_,j)=>xs.reduce((s,x)=>s+x[j],0)/xs.length),ym=ys.reduce((s,v)=>s+v,0)/ys.length;xs.forEach((x,i)=>{X.push(x.map((v,j)=>v-means[j]));y.push(ys[i]-ym);});}
 if(eligible.length<5||X.length<50)return {coefficients:[...defaultPrior],source:'conservative-default',users:eligible.length,rows:X.length};
 return {coefficients:solve(X,y,defaultPrior,0.9).weights,source:'opt-in-population',users:eligible.length,rows:X.length};
}
export function fitTaste(ratings,{prior=defaultPrior,priorSource='conservative-default'}={}){
 if(!Array.isArray(prior)||prior.length!==7||prior.some(x=>!Number.isFinite(x)||x<0))prior=defaultPrior;
 const distinct=latestDistinct(ratings),rows=complete(ratings),n=rows.length;
 const averages=aspectIds.map(id=>{const a=distinct.flatMap(r=>r.answers).filter(a=>a.aspectId===id&&a.score!==null);return {id,value:a.length?a.reduce((s,x)=>s+x.score,0)/a.length:null,n:a.length};});
 const base={version:2,n,distinct:distinct.length,required:12,averages,weights:null,ready:false,priorSource,reason:'Log 12 different films with all seven craft aspects scored. Constant scores do not establish an aspect’s importance; personal impact is not used to predict enjoyment.'};
 if(n<12)return base;const X=rows.map(vector),y=rows.map(r=>r.overall);if(Math.max(...y)-Math.min(...y)<1)return {...base,reason:'More varied overall ratings are needed to learn preferences.'};
 const lambda=Math.max(0.18,6/n),fit=solve(X,y,prior,lambda);if(fit.variances.filter(v=>v>=0.15).length<2)return {...base,reason:'More variation across craft scores is needed. Constant scores are not evidence that an aspect is unimportant.'};
 const sum=fit.weights.reduce((s,v)=>s+v,0);if(sum<0.03)return {...base,reason:'Not enough positive association yet. Keep logging varied films.'};
 return {...base,ready:true,intercept:fit.intercept,trainingRMSE:Math.sqrt(fit.mse),regularization:lambda,weights:modelAspectIds.map((id,j)=>({id,coefficient:fit.weights[j],weight:fit.weights[j]/sum,variance:fit.variances[j],evidence:fit.variances[j]<0.15?'insufficient-contrast':n<30?'tentative':'developing',priorCoefficient:prior[j]})),reason:'Prior-anchored, regularised associations—not causal importance. Low-variation aspects stay near their prior. Evidence labels are heuristics, not confidence intervals or validated accuracy.'};
}
