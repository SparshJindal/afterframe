import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
// Public assets only. Never insert an authenticated HTML/API response into this cache.
export function createStaticCache(maxBytes=32*1024*1024){const cache=new Map();let bytes=0;
 return async function serve(req,res,full,ext){let encoded=false;let stat;try{stat=await fs.stat(full)}catch(e){if(e.code!=='ENOENT'||!full.endsWith('.webp'))throw e;stat=await fs.stat(full+'.b64');encoded=true;}if(!stat.isFile())throw Object.assign(Error('Not found'),{code:'ENOENT'});let entry=cache.get(full);
 if(!entry||entry.mtime!==stat.mtimeMs){if(entry){bytes-=entry.body.length;cache.delete(full);}const body=encoded?Buffer.from(await fs.readFile(full+'.b64','utf8'),'base64'):await fs.readFile(full);entry={mtime:stat.mtimeMs,body,etag:'"'+createHash('sha256').update(body).digest('hex')+'"'};if(body.length<=maxBytes){while(bytes+body.length>maxBytes&&cache.size){const oldest=cache.keys().next().value;bytes-=cache.get(oldest).body.length;cache.delete(oldest);}cache.set(full,entry);bytes+=body.length;}}
 else{cache.delete(full);cache.set(full,entry);}
 const versioned=/\.[a-f0-9]{12}\.webp$/.test(full);res.setHeader('Cache-Control',ext==='.html'?'no-store':versioned?'public, max-age=31536000, s-maxage=31536000, immutable':'no-cache');res.setHeader('ETag',entry.etag);
 if(req.headers['if-none-match']?.split(',').map(s=>s.trim()).some(s=>s===entry.etag||s==='W/'+entry.etag||s==='*')){res.writeHead(304);res.end();return;}
 res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'}[ext]||'application/octet-stream'),'Content-Length':entry.body.length});res.end(req.method==='HEAD'?undefined:entry.body);
 };}
