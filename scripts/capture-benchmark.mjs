import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
const out='docs/benchmark-captures';await mkdir(out,{recursive:true});
const browser=await chromium.launch();const results=[];
for(const [name,url] of [['shola','https://sholarichards.com/'],['tony','https://www.tonyrobbins.com/'],['orlando','https://orlandodenegri.com/']]){
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce',deviceScaleFactor:1});const page=await context.newPage();
  try{
   const r=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(5500);
   await page.screenshot({path:`${out}/${name}-${width}-hero.png`});
   const data=await page.evaluate(()=>({title:document.title,url:location.href,headings:[...document.querySelectorAll('h1,h2,h3')].slice(0,40).map(x=>({text:x.textContent?.trim(),tag:x.tagName,font:getComputedStyle(x).fontFamily,size:getComputedStyle(x).fontSize})),links:[...document.querySelectorAll('a')].map(x=>({text:x.innerText.trim(),href:x.href})).filter(x=>x.text).slice(0,100),buttons:[...document.querySelectorAll('button')].map(x=>x.innerText||x.getAttribute('aria-label')).filter(Boolean),bodyHeight:document.body.scrollHeight,videos:[...document.querySelectorAll('video')].map(x=>({auto:x.autoplay,muted:x.muted,poster:x.poster}))}));
   await page.evaluate(()=>scrollTo(0,innerHeight));await page.waitForTimeout(1000);await page.screenshot({path:`${out}/${name}-${width}-story.png`});
   results.push({name,width,status:r.status(),...data});
  }catch(e){results.push({name,width,error:e.message});}
  await context.close();
 }
}
await writeFile(`${out}/observations.json`,JSON.stringify(results.map(x=>({name:x.name,width:x.width,status:x.status,url:x.url,title:x.title,error:x.error,fontFamilies:[...new Set((x.headings||[]).map(h=>h.font))]})),null,2));console.log(JSON.stringify(results.map(x=>({name:x.name,width:x.width,status:x.status,url:x.url,title:x.title,buttons:x.buttons,error:x.error})),null,2));await browser.close();
