// Local test server only; production hosting is GitHub Pages.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.txt':'text/plain'};
createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const base='/juancapower-web-v2';
  if(pathname!==base && !pathname.startsWith(base+'/')){res.writeHead(404).end();return;}
  let file=resolve(root,'.'+pathname.slice(base.length));
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/html'});res.end(await readFile(resolve(root,'404.html')));}
}).listen(4321,'127.0.0.1',()=>console.log('Preview listening at http://127.0.0.1:4321/juancapower-web-v2/'));
