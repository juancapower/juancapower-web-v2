import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const root='/juancapower-web-v2/';
for(const width of [360,390,768,1024,1440]){
 test(`Approved Stage Presence gallery at ${width}`,async({page,request},info)=>{
  await page.setViewportSize({width,height:width<500?844:900});await page.emulateMedia({reducedMotion:'reduce'});
  let imageBytes=0;const failed:string[]=[];
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
  expect((await page.goto(root))?.status()).toBe(200);await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.stage-hero')).toBeVisible();await expect(page.locator('.review-strip')).toHaveCount(0);
  const photos=page.locator('.presence-gallery figure');await expect(photos).toHaveCount(4);
  for(const figure of await photos.all()){
   const image=figure.locator('img');await image.scrollIntoViewIfNeeded();await expect(image).toHaveJSProperty('complete',true);
   const geometry=await image.evaluate((i:HTMLImageElement)=>({naturalRatio:i.naturalWidth/i.naturalHeight,ratio:i.getBoundingClientRect().width/i.getBoundingClientRect().height,width:i.getBoundingClientRect().width,objectFit:getComputedStyle(i).objectFit,current:i.currentSrc,loading:i.loading,srcset:i.srcset}));
   imageBytes+=(await (await request.get(geometry.current)).body()).byteLength;
   expect(geometry.objectFit).toBe('contain');expect(Math.abs(geometry.naturalRatio-geometry.ratio)).toBeLessThan(.006);
   expect(geometry.loading).toBe('lazy');expect(geometry.srcset.split(',')).toHaveLength(3);
   expect(geometry.width).toBeGreaterThan(150);
   expect(await image.getAttribute('alt')).toBeTruthy();await expect(figure.locator('figcaption')).not.toBeEmpty();
  }
  expect(imageBytes).toBeLessThan(width<500?350000:1200000);
  await info.attach('gallery-image-budget',{body:JSON.stringify({width,devicePixelRatio:1,imageBytes,photoCount:4}),contentType:'application/json'});
  const lead=await page.locator('.gallery-lead').boundingBox();const secondary=await page.locator('.gallery-stage').boundingBox();
  if(width>700){expect(lead!.height).toBeGreaterThan(secondary!.height*1.5);expect(secondary!.y).toBeGreaterThan(lead!.y+40);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();expect(results.violations).toEqual([]);
  const html=await page.content();expect(html).not.toMatch(/DtP_Testimonio|Testimonio_[A-Za-z]|<video|<iframe/i);
  expect(failed).toEqual([]);
  if(width===390||width===1440) await page.screenshot({path:info.outputPath(`home-full-${width}.png`),fullPage:true});
  await page.locator('.presence-experience-editorial').screenshot({path:info.outputPath(`gallery-${width}.png`)});
 });
}
test('Photographic root uses live destinations and retains keyboard access',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(root);
 await expect(page.locator('.stage-hero').getByRole('link',{name:'Contrátame como speaker',exact:true})).toHaveAttribute('href',root+'speaker/');
 await page.locator('summary').focus();await page.keyboard.press('Enter');
 await page.getByRole('navigation',{name:'Navegación móvil'}).getByRole('link',{name:'Experiencia',exact:true}).click();
 await expect(page).toHaveURL(/#experiencia$/);await expect(page.getByRole('heading',{name:'La presencia también se comparte.',exact:false})).toBeVisible();
 await page.getByRole('link',{name:'Contacto',exact:true}).click();await expect(page).toHaveURL(/contacto\/$/);
});
