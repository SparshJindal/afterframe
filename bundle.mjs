// Authenticated journals cannot be shipped as a localStorage-only HTML demo.
// This bundle is a LANDING/UI preview only. Account actions require the real server.
import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
let html=await fs.readFile(path.join(root,'public/landing.html'),'utf8');
const css=(await fs.readFile(path.join(root,'public/landing.css'),'utf8'))+'\n'+await fs.readFile(path.join(root,'public/auth.css'),'utf8');
const policy=await fs.readFile(path.join(root,'public/password-policy.js'),'utf8');
const client=await fs.readFile(path.join(root,'public/auth-client.js'),'utf8');
const landing=await fs.readFile(path.join(root,'public/landing.js'),'utf8');
const js=('window.AF_LANDING_PREVIEW=true;\n'+policy+'\n'+client+'\n'+landing).replace(/^import .*?;\n/gm,'').replace(/\bexport /g,'');
for(const file of [...new Set(html.match(/\/assets\/optimized\/[a-z0-9.-]+\.webp/g)||[])]){const uri='data:image/webp;base64,'+(await fs.readFile(path.join(root,'public',file))).toString('base64');html=html.split(file).join(uri);}
html=html.replace('<link rel="icon" href="assets/favicon.svg">','').replace('<link rel="stylesheet" href="landing.css"><link rel="stylesheet" href="auth.css">',()=>`<style>${css}</style>`).replace('<script type="module" src="landing.js"></script>',()=>`<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`);
await fs.writeFile(path.join(root,'../Afterframe-landing-preview.html'),html);
console.log('Built a self-contained landing preview. Authentication is intentionally unavailable offline.');
