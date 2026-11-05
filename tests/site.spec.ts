import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = '/juancapower-web-v2/';
const routes = ['', 'speaker/', 'contacto/'];
for (const width of [360,375,768,1024,1440]) {
  for (const route of routes) {
    test(`${route || 'home'} at ${width}px`, async ({page}, testInfo) => {
      await page.setViewportSize({width,height:900});
      const errors: string[]=[]; const failed:string[]=[]; const external:string[]=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
      page.on('request',r=>{if(new URL(r.url()).origin!==new URL(testInfo.project.use.baseURL as string).origin)external.push(r.url());});
      const response=await page.goto(base+route); expect(response?.status()).toBe(200);
      await page.evaluate(()=>document.fonts.ready);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const image of await page.locator('img').all()) { await image.scrollIntoViewIfNeeded(); await expect(image).toHaveJSProperty('complete',true); expect(await image.evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBeGreaterThan(0); }
      await page.evaluate(()=>scrollTo(0,0));
      const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
      expect(results.violations).toEqual([]);
      expect(errors).toEqual([]);expect(failed).toEqual([]);expect(external).toEqual([]);
      expect(await page.context().cookies()).toEqual([]);
      expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
      if(width===360||width===1440) await page.screenshot({path:testInfo.outputPath(`${route.replace('/','')||'home'}-${width}.png`),fullPage:true});
      if(!route) await expect(page.locator('h1')).toHaveText(/No esperes\s*motivación\.\s*Crea el\s*resultado\./);
      if(!route && width===360){const box=await page.getByRole('link',{name:'Agenda una sesión de orientación',exact:false}).first().boundingBox();expect(box!.y+box!.height).toBeLessThan(800);}
    });
  }
}
test('keyboard, menu, navigation and reduced motion',async({page})=>{
  await page.setViewportSize({width:375,height:812}); await page.goto(base);
  await page.keyboard.press('Tab'); await expect(page.getByRole('link',{name:'Saltar al contenido'})).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused();
  await page.locator('summary').focus();await page.keyboard.press('Enter');
  await expect(page.locator('.presence-menu')).toHaveAttribute('open','');
  await page.getByRole('navigation',{name:'Navegación móvil',exact:true}).getByRole('link',{name:'Speaker y talleres',exact:true}).click();
  await expect(page).toHaveURL(/speaker\/$/); await expect(page.getByRole('heading',{level:1})).toContainText('Ideas');
  await expect(page.getByRole('link',{name:'Solicita una conferencia o taller'}).first()).toHaveAttribute('href',/^https:\/\/wa.me\/51963335717/);
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);
  expect(await page.locator('.presence-button').first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.setViewportSize({width:812,height:375});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('404 and 200% text zoom remain usable',async({page})=>{
 await page.goto(base+'404.html');await expect(page.getByRole('link',{name:'Volver al inicio'})).toHaveAttribute('href',base);
 await page.goto(base);await page.setViewportSize({width:1024,height:768});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
