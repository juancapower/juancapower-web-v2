type Choice={version:string;at:number;analytics:boolean;advertising:boolean};
type Pixel=((...args:unknown[])=>void)&{queue:unknown[][];loaded:boolean;version:string;push:unknown;callMethod?:(...args:unknown[])=>void};
declare global {interface Window {fbq?:Pixel;_fbq?:Pixel;beTracker?:{t:(data:{hash:string})=>void}}}
const root=document.querySelector<HTMLElement>('#consent-root');
if(root){
 const key='juancapower.consent.v1';const version=root.dataset.version!;const days=Number(root.dataset.days);const enabled=root.dataset.enabled==='true'||(root.dataset.preview==='true'&&['127.0.0.1','localhost'].includes(location.hostname));
 const storage=()=>days>0?localStorage:sessionStorage;
 const banner=document.querySelector<HTMLElement>('#consent-banner')!;const dialog=document.querySelector<HTMLDialogElement>('#consent-dialog')!;const form=document.querySelector<HTMLFormElement>('#consent-form')!;const status=document.querySelector<HTMLElement>('#consent-status')!;
 const field=(n:string)=>form.elements.namedItem(n) as HTMLInputElement;
 const read=():Choice|undefined=>{if(location.search==='?privacy=off')return undefined;try{const v=JSON.parse(storage().getItem(key)||'null');if(v&&v.version===version&&typeof v.analytics==='boolean'&&typeof v.advertising==='boolean'&&Number.isFinite(v.at)&&v.at<=Date.now()&&(days===0||Date.now()-v.at<days*86400000))return v}catch{}return undefined};
 let choice=read();let analyticsLoaded=false;let advertisingLoaded=false;
 const safe=()=>{const relative=location.pathname.slice(root.dataset.base!.length);return location.pathname.startsWith(root.dataset.base!)&&['','coaching/','speaker/','comunidad/','conversaciones-que-despiertan/','sobre-mi/'].includes(relative)&&!location.search&&!location.hash&&!/[?#]/.test(document.referrer)};
 const script=(src:string,onload:()=>void)=>{const el=document.createElement('script');el.src=src;el.async=true;el.referrerPolicy='no-referrer';el.onload=onload;document.head.append(el)};
 const load=()=>{if(!enabled||!safe()||!choice)return;
  if(choice.analytics&&!analyticsLoaded){analyticsLoaded=true;script('https://tracker.metricool.com/resources/be.js',()=>{if(choice?.analytics)window.beTracker?.t({hash:'1869759eb0570e8f4999143cf4d7caf2'})})}
  if(choice.advertising&&!advertisingLoaded){advertisingLoaded=true;const q=function(...args:unknown[]){if(q.callMethod)q.callMethod(...args);else q.queue.push(args)} as Pixel;q.queue=[];q.loaded=true;q.version='2.0';q.push=q;window.fbq=q;window._fbq=q;q('set','autoConfig',false,'949820287954925');q('consent','grant');q('init','949820287954925');q('track','PageView');script('https://connect.facebook.net/en_US/fbevents.js',()=>{})}
 };
 const clearMeta=()=>{for(const name of ['_fbp','_fbc']){document.cookie=name+'=; Max-Age=0; Path=/; SameSite=Lax';const parts=location.hostname.split('.');for(let i=0;i<parts.length-1;i++)document.cookie=name+'=; Max-Age=0; Path=/; Domain=.'+parts.slice(i).join('.')+'; SameSite=Lax'}};
 const save=(analytics:boolean,advertising:boolean)=>{const next={version,at:Date.now(),analytics,advertising};try{storage().setItem(key,JSON.stringify(next))}catch{choice=undefined;window.fbq?.('consent','revoke');clearMeta();try{storage().removeItem(key)}catch{}if(analyticsLoaded||advertisingLoaded){location.replace(location.pathname+'?privacy=off');return}status.textContent='No pudimos guardar tu elección. Los proveedores opcionales permanecen bloqueados.';return}const reload=(analyticsLoaded&&!analytics)||(advertisingLoaded&&!advertising);choice=next;banner.hidden=true;dialog.close();if(!advertising){window.fbq?.('consent','revoke');clearMeta()}if(reload){location.replace(location.pathname);return}status.textContent=enabled?'Preferencias guardadas. Puedes cambiarlas en Configurar cookies.':'Preferencias guardadas. Los proveedores siguen desactivados en esta versión de staging.';load()};
 document.querySelectorAll<HTMLButtonElement>('[data-cookie-settings]').forEach(button=>button.addEventListener('click',()=>{field('analytics').checked=choice?.analytics||false;field('advertising').checked=choice?.advertising||false;document.querySelector('#consent-environment')!.textContent=enabled?'Opcionales apagados hasta tu autorización.':'Proveedores desactivados en staging hasta aprobar la revisión legal y técnica.';dialog.showModal()}));
 document.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach(button=>button.addEventListener('click',()=>save(button.dataset.consent==='all',button.dataset.consent==='all')));
 form.addEventListener('submit',e=>{e.preventDefault();save(field('analytics').checked,field('advertising').checked)});document.querySelector('#consent-close')!.addEventListener('click',()=>dialog.close());
 addEventListener('storage',event=>{if(event.key===key){window.fbq?.('consent','revoke');location.replace(location.pathname)}});
 banner.hidden=!enabled||!!choice;load();
}
export {};
