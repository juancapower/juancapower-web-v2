import {readFile,mkdir,writeFile} from 'node:fs/promises';
const rows=JSON.parse(await readFile('src/data/gallery.json','utf8'));await mkdir('public/images/gallery',{recursive:true});const evidence=[];
for(const row of rows){for(const width of row.variants){const url=row.source.replace('/upload/',`/upload/f_webp,q_82,c_limit,w_${width}/`);const response=await fetch(url);if(!response.ok)throw Error(`${row.slug}: ${response.status}`);const bytes=Buffer.from(await response.arrayBuffer());const name=`${row.slug}-${width}.webp`;await writeFile(`public/images/gallery/${name}`,bytes);evidence.push({file:name,bytes:bytes.length,requestedWidth:width});}}
await writeFile('docs/gallery-review/image-budget.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
