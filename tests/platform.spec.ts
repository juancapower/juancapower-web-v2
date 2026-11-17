import {test,expect} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';
for(const width of [360,390,768,1024,1440])for(const route of ['speaker','test-power4','comunidad','recursos','sobre-mi','contacto','privacidad','cookies','terminos','aviso-legal','libro-de-reclamaciones'])test(`${route} ${width}`,async({page},info)=>{await page.setViewportSize({width,height:900});expect((await page.goto(`/juancapower-web-v2/${route}/`))?.status()).toBe(200);await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate((i:HTMLImageElement)=>i.decode());}await page.evaluate(()=>scrollTo(0,0));await expect(page.locator('footer')).toHaveCount(1);if(width===390||width===1440)await page.screenshot({path:info.outputPath(`${route}-${width}.png`),fullPage:true});});
async function answerMap(page: import('@playwright/test').Page, answers: number[]) {
 for (const [index, value] of answers.entries()) {
  await expect(page.locator('.power-step:visible fieldset')).toHaveCount(1);
  await expect(page.locator('#step-meter')).toHaveAttribute('max', '12');
  await expect(page.locator('#step-meter')).toHaveJSProperty('value', index + 1);
  await page.locator('input[name=q' + index + '][value="' + value + '"]').check();
  if (index < answers.length - 1) await page.getByRole('button', {name:'Siguiente', exact:true}).press('Enter');
 }
 await page.getByRole('button', {name:'Ver mi mapa POWER 4'}).click();
}

for (const value of [1,3,5]) test('12 answers score ' + value, async ({page}) => {
 await page.goto('/juancapower-web-v2/test-power4/');
 await expect(page.locator('fieldset')).toHaveCount(12);
 await expect(page.locator('#capture-entry')).toHaveCount(0);
 await answerMap(page, Array(12).fill(value));
 await expect(page.locator('.result-row h3')).toHaveText(['Espíritu','Mentalidad','Cuerpo','Emoción'].map(p => p + ': ' + (value - 1) * 25 + '%'));
 await expect(page.locator('#score-summary')).toContainText('Los cuatro pilares empataron');
 await expect(page.locator('.map-band').first()).toHaveText({1:'Área que merece refuerzo',3:'Área en desarrollo',5:'Fortaleza percibida'}[value]!);
 expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
 await page.getByRole('button', {name:'Repetir test',exact:true}).click();
 await expect(page.locator('input:checked')).toHaveCount(0);
 await expect(page.locator('#step-label')).toHaveText('Pregunta 1 de 12 · Espíritu');
});

test('mixed answers, incomplete validation, back, keyboard and reset', async ({page}, info) => {
 const submissions: string[] = [];
 page.on('request', request => { if (request.method() !== 'GET') submissions.push(request.url()); });
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/juancapower-web-v2/test-power4/');
 await page.getByRole('button',{name:'Siguiente', exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('Selecciona una opción');
 const first = page.locator('input[name=q0][value="1"]');
 await expect(first).toBeFocused();
 await page.keyboard.press('Space');
 await expect(first).toBeChecked();
 await page.locator('#next-step').press('Enter');
 await expect(page.locator('#step-label')).toBeFocused();
 await page.locator('#previous-step').press('Enter');
 await expect(first).toBeChecked();
 await answerMap(page, [1,2,3,2,2,3,3,3,4,3,4,4]);
 await expect(page.locator('.result-row h3')).toHaveText(['Espíritu: 25%','Mentalidad: 33%','Cuerpo: 58%','Emoción: 67%']);
 await expect(page.locator('#score-summary')).toContainText('Mayor índice percibido: Emoción. Oportunidad para explorar: Espíritu.');
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 expect(submissions).toEqual([]);
 await page.screenshot({path:info.outputPath('map-result-390.png'),fullPage:true});
 await page.reload();
 await expect(page.locator('input:checked')).toHaveCount(0);
});

test('commercial funnels, footer and intent specific community links',async({page})=>{
 await page.goto('/juancapower-web-v2/');await page.getByRole('navigation',{name:'Navegación principal',exact:true}).getByRole('link',{name:'Coaching POWER 4'}).click();await expect(page).toHaveURL(/coaching\/$/);await expect(page.getByRole('link',{name:/Agenda tu sesión de orientación/}).first()).toHaveAttribute('href',/calendar.google.com/);
 await expect(page.locator('footer')).toHaveCount(1);await page.getByRole('navigation',{name:'Navegación principal',exact:true}).getByRole('link',{name:'Speaker y talleres'}).click();const speaker=await page.getByRole('link',{name:'Solicita una conferencia o taller'}).first().getAttribute('href');expect(decodeURIComponent(speaker!)).toContain('Audiencia');
 await page.goto('/juancapower-web-v2/comunidad/');const community=await page.getByRole('link',{name:'Unirme a Comunidad JuanCa Power'}).getAttribute('href');const conversations=await page.getByRole('link',{name:'Unirme a Conversaciones que Despiertan'}).getAttribute('href');expect(community).toBe('https://chat.whatsapp.com/CU66rNoc1hEB8hOFiy21Pe');expect(conversations).toBe('https://chat.whatsapp.com/JXQS8bpk8oE3xkYKhLVgSP');expect(community).not.toBe(speaker);
});

test('no-JavaScript evaluation never transmits responses',async({browser})=>{const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('/juancapower-web-v2/test-power4/');await expect(page.locator('.power-step:visible fieldset')).toHaveCount(1);await expect(page.locator('#step-label')).toHaveText('Pregunta 1 de 12 · Espíritu');await page.locator('input[name=q0][value="3"]').check();await expect(page.locator('#show-map')).toBeDisabled();await page.keyboard.press('Enter');expect(page.url()).not.toContain('?');await context.close();});

for(const width of [390,1440])test(`404 branded and accessible ${width}`,async({page},info)=>{await page.setViewportSize({width,height:900});await page.goto('/juancapower-web-v2/404.html');await expect(page.getByRole('link',{name:'Volver al inicio'})).toHaveAttribute('href','/juancapower-web-v2/');await expect(page.locator('footer')).toHaveCount(1);expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath(`404-${width}.png`),fullPage:true});});

test('publication keeps tracking, capture and complaint intake off even after consent',async({page})=>{const calls:string[]=[];await page.addInitScript(()=>localStorage.setItem('juancapower.consent.v1',JSON.stringify({version:'DRAFT_2026_11_05',at:Date.now(),analytics:true,advertising:true})));page.on('request',r=>{if(/metricool|facebook|brevo|cloudflare/.test(r.url()))calls.push(r.url())});await page.goto('/juancapower-web-v2/');await expect(page.locator('#consent-banner')).toBeHidden();await page.locator('footer [data-cookie-settings]').click();await expect(page.locator('#consent-environment')).toContainText('desactivados en staging');await page.locator('#consent-dialog [data-consent=none]').click();expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('juancapower.consent.v1')||'null')?.advertising)).toBe(false);await page.goto('/juancapower-web-v2/test-power4/');await expect(page.locator('#capture-entry')).toHaveCount(0);await page.goto('/juancapower-web-v2/libro-de-reclamaciones/');await expect(page.locator('#complaints-form')).toHaveCount(0);expect(calls).toEqual([])});

test('confirmed provider is limited to legal pages and footer stays minimal',async({page})=>{for(const route of ['','coaching/','speaker/']){await page.goto('/juancapower-web-v2/'+route);await expect(page.locator('body')).not.toContainText('20615315525');await expect(page.locator('body')).not.toContainText('JC ESTRATEGIA');await expect(page.locator('footer nav[aria-label="Información legal"] a')).toHaveCount(5);await expect(page.locator('footer').getByRole('link',{name:'Libro de Reclamaciones'})).toBeVisible()}for(const route of ['privacidad','aviso-legal','terminos','libro-de-reclamaciones']){await page.goto('/juancapower-web-v2/'+route+'/');await expect(page.locator('main')).toContainText('JC ESTRATEGIA Y DISEÑO INTEGRAL E.I.R.L.');await expect(page.locator('main')).toContainText('20615315525')}});

test('fiscal address is confined to Privacy and Complaints',async({page})=>{for(const route of ['','coaching/','speaker/','aviso-legal/','terminos/','cookies/']){await page.goto('/juancapower-web-v2/'+route);await expect(page.locator('body')).not.toContainText('CAL.MARCABALITO')}for(const route of ['privacidad/','libro-de-reclamaciones/']){await page.goto('/juancapower-web-v2/'+route);await expect(page.locator('main')).toContainText('CAL.MARCABALITO MZA. I LOTE. 24');await expect(page.locator('footer')).not.toContainText('CAL.MARCABALITO')}});
