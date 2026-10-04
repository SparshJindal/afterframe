"""Prepare MovieLens metadata and anonymous movie-level rating aggregates.
Does not import the source users into Afterframe or fabricate aspect scores.
"""
import csv, json, re, collections, hashlib, pathlib, shutil, argparse
p=argparse.ArgumentParser();p.add_argument('directory');p.add_argument('--output',default='catalogue');args=p.parse_args();base=pathlib.Path(args.directory);out=pathlib.Path(args.output);out.mkdir(parents=True,exist_ok=True)
links={r['movieId']:r for r in csv.DictReader(open(base/'links.csv',encoding='utf8'))}
ratings=collections.defaultdict(list)
for r in csv.DictReader(open(base/'ratings.csv',encoding='utf8')):ratings[r['movieId']].append(float(r['rating']))
tags=collections.defaultdict(collections.Counter)
for r in csv.DictReader(open(base/'tags.csv',encoding='utf8')):
 tag=' '.join(r['tag'].lower().split())
 if 2<=len(tag)<=80:tags[r['movieId']][tag]+=1
seed={('Interstellar',2014):'interstellar',('Whiplash',2014):'whiplash'}
movies=[]
for r in csv.DictReader(open(base/'movies.csv',encoding='utf8')):
 match=re.search(r'\s*\((\d{4})\)\s*$',r['title']);year=int(match.group(1)) if match else None
 title=r['title'][:match.start()].strip() if match else r['title'].strip();article=re.match(r'^(.*), (The|A|An)$',title)
 if article:title=article.group(2)+' '+article.group(1)
 genres=[{'Sci-Fi':'Science fiction','Film-Noir':'Film noir'}.get(g,g) for g in r['genres'].split('|') if g not in ('(no genres listed)','IMAX')]
 link=links[r['movieId']];values=ratings[r['movieId']];movies.append({'id':seed.get((title,year),'ml-'+r['movieId']),'title':title,'originalTitle':r['title'],'year':year,'director':'','genres':genres,'runtime':None,'poster':'','movielensId':int(r['movieId']),'imdbId':'tt'+link['imdbId'].zfill(7) if link['imdbId'] else None,'tmdbId':int(link['tmdbId']) if link['tmdbId'] else None,'tags':[t for t,n in tags[r['movieId']].most_common(12)],'ratingCount':len(values),'ratingMean':round(sum(values)/len(values),6) if values else None,'source':'MovieLens latest-small 2018'})
metadata={'source':'MovieLens latest-small','sourceUrl':'https://grouplens.org/datasets/movielens/','downloadUrl':'https://files.grouplens.org/datasets/movielens/ml-latest-small.zip','version':'2018-09-26','movieCount':len(movies),'ratingCount':sum(len(v) for v in ratings.values()),'tagApplications':3683,'license':'Research use; commercial or revenue-bearing use requires GroupLens permission. Redistribution must retain the same licence conditions.','coverage':'Historical catalogue through 2018. Does not cover all films, languages or recent releases.','sourceHashes':{f:hashlib.sha256((base/f).read_bytes()).hexdigest() for f in ['movies.csv','ratings.csv','tags.csv','links.csv']}}
(out/'movies.json').write_text(json.dumps(movies,ensure_ascii=False,separators=(',',':')),encoding='utf8');(out/'source.json').write_text(json.dumps(metadata,indent=2),encoding='utf8');shutil.copy(base/'README.txt',out/'MOVIELENS-LICENSE.txt');print(json.dumps({k:metadata[k] for k in ['movieCount','ratingCount','tagApplications','version']}));print('Matched starter IDs:',[(m['title'],m['id']) for m in movies if not m['id'].startswith('ml-')])
