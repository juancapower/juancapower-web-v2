import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const root='/juancapower-web-v2/';
for(const width of [360,390,768,1024,1440])test(`Editorial experience and authority ${width}`,async({page,request},info)=>{
 await page.setViewportSize({width,height:width<500?844:900});await page.emulateMedia({reducedMotion:'reduce'});
 const failures:string[]=[],external:string[]=[];page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`)});page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4321/'))external.push(r.url())});
 expect((await page.goto(root))?.status()).toBe(200);await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.stage-hero')).toBeVisible();await expect(page.locator('.review-strip')).toHaveCount(0);
 await expect(page.locator('[data-reel-slide]')).toHaveCount(10);await expect(page.locator('[data-reel-thumb]')).toHaveCount(10);
 let imageBytes=0;
 for(const slide of await page.locator('[data-reel-slide]').all()){
  const image=slide.locator('img');await image.scrollIntoViewIfNeeded();await image.evaluate((i:HTMLImageElement)=>i.decode());const src=await image.evaluate((i:HTMLImageElement)=>i.currentSrc);imageBytes+=(await(await request.get(src)).body()).byteLength;
  expect(await image.evaluate(i=>Math.abs(i.getBoundingClientRect().height-i.parentElement!.getBoundingClientRect().height))).toBeLessThan(1);expect(await image.getAttribute('loading')).toBe('lazy');expect((await image.getAttribute('srcset'))!.split(',')).toHaveLength(3);expect(await image.getAttribute('alt')).toBeTruthy();await expect(slide.locator('figcaption')).not.toBeEmpty();
 }
 expect(imageBytes).toBeLessThan(width<500?250000:900000);await info.attach('gallery-image-budget',{body:JSON.stringify({width,imageBytes,photoCount:10}),contentType:'application/json'});
 await page.locator('#experience-reel').focus();await page.keyboard.press('Home');await expect(page.locator('[data-reel-index]')).toHaveText('01');await expect(page.locator('[data-reel-prev]')).toBeDisabled();
 const stage=page.locator('.shared-stage');
 await expect(stage.getByRole('heading',{level:2})).toHaveText('He compartido escenario con...');
 await expect(stage.locator('.shared-stage-names li')).toHaveText(['Ana Pierr','Regina Carrot','Rita Denegri','Gisela Rosales']);
 await expect(stage).toContainText('no implica aval');
 await expect(stage.locator('figcaption')).toHaveText(['Orlando Denegri','Stefanny Berdejo','Wilfredo Guevara (WIGO Éxito)','Daniela Sarfati','Dr. Bayter','Héctor Raúl González','Jorge Loza']);
 const authority=stage.getByRole('region',{name:'Galería de encuentros'});
 let authorityBytes=0;
 for(const image of await authority.locator('img').all()){
  await image.scrollIntoViewIfNeeded();
  await image.evaluate((photo:HTMLImageElement)=>photo.decode());
  const src=await image.evaluate((photo:HTMLImageElement)=>photo.currentSrc);
  authorityBytes+=(await(await request.get(src)).body()).byteLength;
  expect(await image.getAttribute('alt')).toContain('JuanCa Power');
  expect(await image.getAttribute('loading')).toBe('lazy');
 }
 expect(authorityBytes).toBeLessThan(width<500?240000:690000);
 await info.attach('authority-image-budget',{body:JSON.stringify({width,authorityBytes,photoCount:7}),contentType:'application/json'});
 await authority.evaluate(el=>{el.scrollLeft=0});

 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);expect(await page.content()).not.toMatch(/DtP_Testimonio|Testimonio_[A-Za-z]|<video|<iframe/i);expect(failures).toEqual([]);expect(external).toEqual([]);
 await page.locator('#experience-title').click();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`home-full-${width}.png`),fullPage:true});await page.locator('#experiencia').screenshot({path:info.outputPath(`experience-${width}.png`)});await page.locator('.shared-stage').screenshot({path:info.outputPath(`authority-${width}.png`)});
});

test('Photo controls, keyboard, thumbnails, reduced motion and commercial destinations',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(root);
 await expect(page.locator('.stage-hero').getByRole('link',{name:'Únete a la Comunidad Power',exact:true})).toHaveAttribute('href',root+'comunidad/');
 await page.locator('[data-reel-next]').click();await expect(page.locator('[data-reel-index]')).toHaveText('02');await expect(page.locator('[data-reel-thumb="1"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('#experience-reel').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('[data-reel-index]')).toHaveText('03');await page.keyboard.press('End');await expect(page.locator('[data-reel-index]')).toHaveText('10');await expect(page.locator('[data-reel-next]')).toBeDisabled();await page.keyboard.press('Home');await expect(page.locator('[data-reel-index]')).toHaveText('01');
 await page.locator('[data-reel-thumb="3"]').click();await expect(page.locator('[data-reel-index]')).toHaveText('04');await page.locator('[data-reel-prev]').click();await expect(page.locator('[data-reel-index]')).toHaveText('03');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-reel-next]').click();await expect(page.locator('[data-reel-index]')).toHaveText('04');await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-reel-prev]').click();await expect(page.locator('[data-reel-index]')).toHaveText('03');
 await expect(page.locator('.reel-next a')).toHaveAttribute('href',/https:\/\/wa.me\/51963335717/);await expect(page.locator('.shared-stage .presence-link')).toHaveAttribute('href',/https:\/\/wa.me\/51963335717/);await expect(page.locator('.stage-hero').getByRole('link',{name:'¿Qué te está impidiendo avanzar?',exact:true})).toHaveAttribute('href',root+'test-power4/');
 await page.locator('summary').focus();await page.keyboard.press('Enter');await page.getByRole('navigation',{name:'Navegación móvil'}).getByRole('link',{name:'Experiencia',exact:true}).click();await expect(page).toHaveURL(/#experiencia$/);
});

test('Mobile touch swipes the real native strip',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(root);await page.locator('#experience-reel').scrollIntoViewIfNeeded();const box=(await page.locator('.reel-image').first().boundingBox())!;const client=await context.newCDPSession(page);await client.send('Emulation.setTouchEmulationEnabled',{enabled:true});const y=Math.max(80,box.y+box.height/2),start=box.x+box.width-20,end=box.x+20;
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});for(let i=1;i<=8;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*i/8,y}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(page.locator('[data-reel-index]')).not.toHaveText('01');await client.detach();
});

test('No JavaScript retains native scrolling, photos and conversion',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto(root);await expect(page.locator('[data-reel-slide]')).toHaveCount(10);await expect(page.locator('[data-reel-next]')).toBeHidden();await expect(page.locator('.reel-next a')).toHaveAttribute('href',/^https:\/\/wa.me/);await page.locator('#experience-reel').focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>page.locator('#experience-reel').evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);await context.close();
});

test('Desktop stage panels expand with pointer and keyboard', async ({page}, info) => {
 await page.setViewportSize({width:1440,height:900});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(root);
 const gallery=page.getByRole('region',{name:'Galería de encuentros'});
 const controls=gallery.getByRole('button');
 const frames=gallery.locator('.stage-frame');
 await expect(controls).toHaveCount(7);
 await expect(controls.first()).toHaveAttribute('aria-pressed','true');
 const collapsed=(await frames.nth(1).boundingBox())!.width;
 expect(collapsed).toBeGreaterThanOrEqual(44);
 await controls.nth(1).click();
 await expect(controls.nth(1)).toHaveAttribute('aria-pressed','true');
 await expect(controls.first()).toHaveAttribute('aria-pressed','false');
 expect((await frames.nth(1).boundingBox())!.width).toBeGreaterThan(collapsed*3);
 await page.keyboard.press('ArrowRight');
 await expect(controls.nth(2)).toBeFocused();
 await expect(controls.nth(2)).toHaveAttribute('aria-pressed','true');
 await page.keyboard.press('End');
 await expect(controls.last()).toBeFocused();
 await expect(controls.last()).toHaveAttribute('aria-pressed','true');
 await page.keyboard.press('Home');
 await expect(controls.first()).toBeFocused();
 await page.keyboard.press('Tab');
 await expect(controls.nth(1)).toBeFocused();
 await page.keyboard.press('Space');
 await expect(controls.nth(1)).toHaveAttribute('aria-pressed','true');
 expect(await frames.first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
 for (let index=0;index<7;index++) {
  await controls.nth(index).click();
  const frame=frames.nth(index);
  await frame.locator('img').evaluate((image:HTMLImageElement)=>image.decode());
  await expect(frame.locator('figcaption')).toBeVisible();
  await frame.screenshot({path:info.outputPath(`authority-frame-${index+1}.png`)});
 }
});

test('Authority uses native touch and offers a desktop fallback without scripts', async ({page,context,browser}) => {
 await page.setViewportSize({width:390,height:844});
 await page.goto(root);
 const gallery=page.getByRole('region',{name:'Galería de encuentros'});
 await gallery.scrollIntoViewIfNeeded();
 const box=(await gallery.boundingBox())!;
 const client=await context.newCDPSession(page);
 await client.send('Emulation.setTouchEmulationEnabled',{enabled:true});
 const y=box.y+box.height/2;
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width-25,y}]});
 for(let step=1;step<=10;step++) {
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width-25-step*24,y}]});
 }
 await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(()=>gallery.evaluate(el=>el.scrollLeft)).toBeGreaterThan(180);
 await client.detach();

 const fallback=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});
 try {
  const staticPage=await fallback.newPage();
  await staticPage.goto(root);
  const strip=staticPage.getByRole('region',{name:'Galería de encuentros'});
  await expect(strip.locator('figcaption')).toHaveCount(7);
  await expect(strip.getByRole('button')).toHaveCount(0);
  await strip.focus();
  await staticPage.keyboard.press('ArrowRight');
  await expect.poll(()=>strip.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
 } finally {
  await fallback.close();
 }
});
