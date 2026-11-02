import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = '/juancapower-web-v2/conceptos/';
const routes = ['stage-presence/','power-editorial/','wireframes/home/','wireframes/coaching/','wireframes/speaker/'];
for (const width of [360,390,768,1024,1440]) {
 for (const route of routes) {
  test(`Sprint 1 ${route} at ${width}`, async ({page},info)=>{
   await page.setViewportSize({width,height:width<500?844:900});
   await page.emulateMedia({reducedMotion:'reduce'});
   const errors:string[]=[];const failures:string[]=[];const thirdParties:string[]=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
   page.on('request',r=>{if(new URL(r.url()).origin!==new URL(info.project.use.baseURL as string).origin)thirdParties.push(r.url());});
   expect((await page.goto(base+route))?.status()).toBe(200);
   await page.evaluate(()=>document.fonts.ready);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await expect(page.locator('h1')).toHaveCount(1);
   await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
   for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();expect(await image.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);}
   await page.evaluate(()=>scrollTo(0,0));
   if(!route.startsWith('wireframes')){
    const hero=page.locator('.stage-hero,.editorial-hero');
    await expect(hero.locator('h1')).toHaveText(/No esperes\s*motivación\.\s*Crea el\s*resultado\./);
    for(const name of ['Agenda una sesión de orientación','Contrátame como speaker']){
     const rect=await hero.getByRole('link',{name,exact:true}).boundingBox();
     expect(rect!.height).toBeGreaterThanOrEqual(44);expect(rect!.width).toBeGreaterThanOrEqual(44);
     expect(rect!.y+rect!.height).toBeLessThanOrEqual(width<500?844:900);
    }
    const face=await hero.locator('img').evaluate((img:HTMLImageElement)=>{
     const rect=img.getBoundingClientRect();const style=getComputedStyle(img);
     const [px,py]=style.objectPosition.split(' ').map(x=>parseFloat(x)/100);
     const scale=Math.max(rect.width/img.naturalWidth,rect.height/img.naturalHeight);
     return {x:rect.x+img.naturalWidth*scale*.66-(img.naturalWidth*scale-rect.width)*px,y:rect.y+img.naturalHeight*scale*.35-(img.naturalHeight*scale-rect.height)*py};
    });
    expect(face.x).toBeGreaterThan(0);expect(face.x).toBeLessThan(width);expect(face.y).toBeGreaterThan(95);
    if(route==='power-editorial/'){
     const copy=await page.locator('.editorial-copy').boundingBox();const punch=await page.locator('.editorial-result').boundingBox();
     if(width>700)expect(copy!.y+copy!.height+12).toBeLessThan(punch!.y);
     expect(face.y+12).toBeLessThan(punch!.y);
    }
   }
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();expect(axe.violations).toEqual([]);
   expect(errors).toEqual([]);expect(failures).toEqual([]);expect(thirdParties).toEqual([]);
   if(width===390||width===1440)await page.screenshot({path:info.outputPath(`${route.replaceAll('/','-')}${width}.png`),fullPage:true});
  });
 }
}
test('Sprint 1 keyboard, optional test and reduced motion live toggle',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(base+'stage-presence/');
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Saltar al contenido'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
 await page.locator('summary').focus();await page.keyboard.press('Enter');
 await page.getByRole('navigation',{name:'Navegación móvil'}).getByRole('link',{name:'Coaching POWER 4'}).click();
 await expect(page).toHaveURL(/wireframes\/coaching\/$/);
 await page.getByText('¿Tengo que completar el test?',{exact:true}).click();
 await expect(page.getByText('No. Será un cuestionario opcional', {exact:false})).toBeVisible();
 await expect(page.getByRole('link',{name:'Agenda una sesión de orientación'}).first()).toHaveAttribute('href',/^https:\/\/calendar.google.com\//);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+'stage-presence/');
 expect(await page.locator('.stage-image img').evaluate(x=>getComputedStyle(x).animationName)).toBe('stage-arrival');
 await page.emulateMedia({reducedMotion:'reduce'});
 expect(await page.locator('.stage-image img').evaluate(x=>getComputedStyle(x).animationName)).toBe('none');
 await page.goto(base+'power-editorial/');
 expect(await page.locator('.editorial-result').evaluate(x=>getComputedStyle(x,'::after').animationName)).toBe('none');
});
test('Sprint 1 gallery, internal links and encoded content',async({page,request})=>{
 await page.goto(base);await expect(page.getByRole('heading',{level:1})).toContainText('PRESENCE.');
 const hrefs=await page.locator('a[href]').evaluateAll(xs=>xs.map(x=>(x as HTMLAnchorElement).href));
 for(const href of [...new Set(hrefs)]){if(href.startsWith(new URL(page.url()).origin)&&!href.endsWith('#contenido'))expect((await request.get(href)).status()).toBe(200);}
 await page.getByRole('link',{name:/APROBADA/}).click();await expect(page).toHaveURL(/stage-presence\/$/);
 await page.setViewportSize({width:780,height:390});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
