import sharp from 'sharp';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base=new URL('../public/assets/',import.meta.url), output=new URL('optimized/',base);
await fs.mkdir(output,{recursive:true});
const manifest={};let originalBytes=0,generatedBytes=0;
for(const file of ['interstellar.jpg','parasite.jpg','whiplash.jpg','past-lives.jpg','hero.jpg','mascot.png']){
 const input=await fs.readFile(new URL(file,base));originalBytes+=input.length;const variants=[];
 for(const width of [320,640,960]){const {data,info}=await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:78,effort:5}).toBuffer({resolveWithObject:true});const hash=createHash('sha256').update(data).digest('hex').slice(0,12);const name=`${file.split('.')[0]}-${info.width}.${hash}.webp`;await fs.writeFile(new URL(name,output),data);await fs.writeFile(new URL(name+'.b64',output),data.toString('base64')+'\n');generatedBytes+=data.length;variants.push({src:'/assets/optimized/'+name,width:info.width,height:info.height,bytes:data.length});}
 manifest['assets/'+file]={variants:[...new Map(variants.map(v=>[v.width,v])).values()]};
}
await fs.writeFile(new URL('../public/image-manifest.js',import.meta.url),'// Generated; run npm run images after replacing source artwork.\nexport const imageManifest='+JSON.stringify(manifest)+';\n');
console.log(JSON.stringify({originalBytes,generatedBytes,images:Object.keys(manifest).length}));
// Refresh existing static landing/hero references as well as the generated manifest.
const publicRoot=new URL('../public/',import.meta.url);
const lookup=new Map(Object.entries(manifest).map(([file,m])=>[file.split('/').at(-1).split('.')[0],m]));
for(const file of ['landing.html','styles.css','app.js']){let text=await fs.readFile(new URL(file,publicRoot),'utf8');text=text.replace(/\/assets\/optimized\/([a-z-]+)-(\d+)\.[a-f0-9]{12}\.webp/g,(url,stem,width)=>{const m=lookup.get(stem);return m?(m.variants.find(v=>v.width===Number(width))||m.variants.at(-1)).src:url;});await fs.writeFile(new URL(file,publicRoot),text);}
