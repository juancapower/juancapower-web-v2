import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('docs/gallery-review',{recursive:true});const browser=await chromium.launch();const report=[];
for(const width of [360,390,768,1024,1440]){
 const page=await browser.newPage({viewport:{width,height:width<500?844:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4322/juancapower-web-v2/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`docs/gallery-review/home-${width}-hero.png`});
 for(const image of await page.locator('.presence-gallery img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(i=>i.decode());}
 await page.locator('.presence-experience-editorial').screenshot({path:`docs/gallery-review/gallery-${width}.png`});
 if(width===390||width===1440)await page.screenshot({path:`docs/gallery-review/home-${width}-full.png`,fullPage:true});
 const photos=await page.locator('.presence-gallery img').evaluateAll(xs=>xs.map(i=>({alt:i.alt,url:i.currentSrc,natural:[i.naturalWidth,i.naturalHeight],rendered:[i.getBoundingClientRect().width,i.getBoundingClientRect().height]})));
 report.push({width,photos});await page.close();
}
await writeFile('docs/gallery-review/responsive-evidence.json',JSON.stringify(report,null,2));await browser.close();console.log('Galería y Home capturadas en cinco anchos.');
