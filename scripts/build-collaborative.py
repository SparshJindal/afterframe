"""Build aggregate item-item co-like similarities; never ship historical user IDs.
Usage: python scripts/build-collaborative.py /path/to/ml-latest-small/ratings.csv
NumPy is a build-time dependency only (pip install numpy). MovieLens licence applies.
"""
import csv,json,sys,pathlib,gzip,base64,numpy as np
root=pathlib.Path(__file__).resolve().parent.parent
catalogue=json.loads((root/'catalogue/movies.json').read_text())
ids={m['movielensId']:m['id'] for m in catalogue}
# Featured records reuse MovieLens provenance but have stable app IDs.
for m in [{'movielensId':109487,'id':'interstellar'},{'movielensId':112552,'id':'whiplash'}]:ids[m['movielensId']]=m['id']
records=list(csv.DictReader(open(sys.argv[1])))
counts={}
for r in records:
 mid=int(r['movieId']);counts[mid]=counts.get(mid,0)+1
movies=sorted(mid for mid,n in counts.items() if n>=10 and mid in ids)
users=sorted(set(int(r['userId']) for r in records));mi={v:i for i,v in enumerate(movies)};ui={v:i for i,v in enumerate(users)}
A=np.zeros((len(movies),len(users)),dtype=np.float32)
for r in records:
 mid=int(r['movieId']);rating=float(r['rating'])
 if mid in mi and rating>=3.5:A[mi[mid],ui[int(r['userId'])]]=rating-3
B=(A>0).astype(np.float32);norm=np.sqrt((A*A).sum(axis=1));out={}
for start in range(0,len(movies),128):
 end=min(start+128,len(movies));support=B[start:end]@B.T;sim=(A[start:end]@A.T)/np.maximum(norm[start:end,None]*norm[None,:],1e-8);sim*=support/(support+20);sim[support<5]=0
 for local,row in enumerate(sim):
  i=start+local;row[i]=0;top=np.argsort(row)[-40:][::-1];edges=[[ids[movies[j]],round(float(row[j]),5),int(support[local,j])] for j in top if row[j]>0]
  if edges:out[ids[movies[i]]]=edges
payload={'version':1,'source':'MovieLens latest-small historical co-likes','method':'positive-rating cosine; support/(support+20) shrinkage; min 5 shared positive raters; top 40','ratingCount':len(records),'userCount':len(users),'movieCount':len(movies),'neighbors':out}
(root/'catalogue/collaborative.json.gz.b64').write_text(base64.b64encode(gzip.compress(json.dumps(payload,separators=(',',':')).encode(),mtime=0)).decode()+'\n')
print(json.dumps({k:v for k,v in payload.items() if k!='neighbors'}))
