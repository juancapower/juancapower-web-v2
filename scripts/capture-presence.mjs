import { chromium } from '@playwright/test';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('docs/preview-captures',{recursive:true});await mkdir('public/images/presence/previews',{recursive:true});
const browser=await chromium.launch();
for(const [name,route] of [['a','stage-presence'],['b','power-editorial']]){
 for(const width of [360,390,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:width<500?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  await page.goto(`http://127.0.0.1:4322/juancapower-web-v2/conceptos/${route}/`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`docs/preview-captures/${name}-${width}.png`});
  if(width===1440)await page.screenshot({path:`public/images/presence/previews/${name}-${width}.jpg`,type:'jpeg',quality:85});
  if(width===390||width===1440)await page.screenshot({path:`docs/preview-captures/${name}-${width}-full.png`,fullPage:true});
  if(name==='a' && (width===390||width===1440)){for(const [key,selector] of [['method','.presence-method'],['choice','.presence-choice'],['experience','.presence-experience']]){await page.locator(selector).screenshot({path:`docs/preview-captures/${key}-${width}.png`});}await page.evaluate(()=>scrollTo(0,0));}
  const hero=page.locator('.stage-hero,.editorial-hero');
  console.log(JSON.stringify({concept:name,width,height:width<500?844:900,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),primary:await hero.getByRole('link',{name:'Agenda una sesión de orientación',exact:true}).boundingBox(),secondary:await hero.getByRole('link',{name:'Contrátame como speaker',exact:true}).boundingBox()}));await page.close();
 }
}
for(const route of ['home','coaching','speaker']){
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});await page.goto(`http://127.0.0.1:4322/juancapower-web-v2/conceptos/wireframes/${route}/`,{waitUntil:'networkidle'});await page.screenshot({path:`docs/preview-captures/wireframe-${route}-${width}.png`,fullPage:true});await page.close();
 }
}
await browser.close();
