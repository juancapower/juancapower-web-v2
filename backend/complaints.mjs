import {releaseAvailable,recipientAllowed} from './release-gate.mjs';
import {complaintReceipt} from './complaint-receipt.mjs';
// Separate Worker: never deployed or activated by the Pages workflow.
const enc=new TextEncoder();
async function mac(s,key){const k=await crypto.subtle.importKey('raw',enc.encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',k,enc.encode(s))),v=>v.toString(16).padStart(2,'0')).join('')}
async function encrypt(value,key){const iv=crypto.getRandomValues(new Uint8Array(12));const k=await crypto.subtle.importKey('raw',Uint8Array.from(key.match(/../g),x=>parseInt(x,16)),'AES-GCM',false,['encrypt']);const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,enc.encode(JSON.stringify(value)));return [...iv,...new Uint8Array(cipher)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const keys=['requestId','name','documentType','documentNumber','address','email','phone','minor','guardian','kind','service','amount','detail','request','website','botToken'];
const plain=(v,max=2500)=>typeof v==='string'&&v.trim().length>0&&v.length<=max&&!/[<>\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v);
export function createComplaints({fetcher=fetch,synthetic=false}={}){return async(request,env)=>{
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};const reply=(code,data)=>Response.json(data.number?{...data,provider:{name:env.PROVIDER_LEGAL_NAME,ruc:env.PROVIDER_RUC,address:env.PROVIDER_ADDRESS}}:data,{status:code,headers});const origin=request.headers.get('Origin');const allowed=(env.ALLOWED_ORIGINS||'').split(',');if(!allowed.includes(origin)||!origin)return reply(403,{error:'ORIGIN'});headers['Access-Control-Allow-Origin']=origin;
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
 const { pathname, hostname } = new URL(request.url);
 const health = pathname === '/v1/complaints/health' && request.method === 'GET';
 if (!health && (pathname !== '/v1/complaints' || request.method !== 'POST')) return reply(404,{error:'PATH'});
 const local=synthetic&&fetcher!==globalThis.fetch&&env.TEST_MODE==='local'&&['localhost','127.0.0.1'].includes(hostname);
 if(env.COMPLAINTS_ENABLED!=='true'||env.LEGAL_APPROVED!=='true')return reply(503,{error:'DISABLED'});
 if(!local&&!releaseAvailable(env))return reply(503,{error:'RELEASE_NOT_APPROVED'});
 if(!env.DB||!plain(env.PROVIDER_LEGAL_NAME,200)||!/^\d{11}$/.test(env.PROVIDER_RUC||'')||!plain(env.PROVIDER_ADDRESS,300)||!env.HMAC_SECRET||env.HMAC_SECRET.length<32||!/^[a-f0-9]{64}$/i.test(env.ENCRYPTION_KEY||'')||(!local&&env.COMPLAINTS_RETENTION_APPROVED!=='true')||(local&&!env.COMPLAINTS_RETENTION_APPROVED))return reply(503,{error:'CONFIG'});
 const canNotify = !!env.BREVO_API_KEY && (local || env.LIVE_SENDS_ENABLED === 'true');
 if (health) {
   if (env.CONTROLLED_TEST_ONLY !== 'false') return reply(503,{error:'CONTROLLED_ONLY'});
   if (!canNotify || !env.TURNSTILE_SECRET) return reply(503,{error:'CONFIG'});
   try {
     await env.DB.prepare('SELECT id FROM complaints LIMIT 1').bind().first();
     return reply(200,{status:'READY',version:2});
   } catch {
     return reply(503,{error:'SERVICE'});
   }
 }
 if (!local && !env.TURNSTILE_SECRET) return reply(503,{error:'ANTISPAM'});
 try{
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return reply(415,{error:'TYPE'});
 let size=0,chunks=[];const reader=request.body?.getReader();if(!reader)return reply(400,{error:'BODY'});for(;;){const c=await reader.read();if(c.done)break;size+=c.value.length;if(size>12000){await reader.cancel();return reply(413,{error:'SIZE'})}chunks.push(c.value)}const all=new Uint8Array(size);let offset=0;for(const c of chunks){all.set(c,offset);offset+=c.length}let d;
 try { d=JSON.parse(new TextDecoder().decode(all)); } catch { return reply(400,{error:'INVALID'}); }
 if(!d||Array.isArray(d)||Object.keys(d).some(k=>!keys.includes(k))||!/^([a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/i.test(d.requestId)||!plain(d.name,120)||!['DNI','CE','Pasaporte'].includes(d.documentType)||!plain(d.documentNumber,20)||!plain(d.address,300)||typeof d.email!=='string'||!/^([^\s@<>]+)@([^\s@<>]+)\.([^\s@<>]+)$/.test(d.email)||d.email.length>254||typeof d.phone!=='string'||!/^\+?[0-9 ()-]{7,25}$/.test(d.phone)||typeof d.minor!=='boolean'||(d.minor&&!plain(d.guardian,200))||(!d.minor&&d.guardian!=='')||!['Reclamo','Queja'].includes(d.kind)||!plain(d.service,300)||typeof d.amount!=='string'||!/^(0|[1-9]\d{0,8})(\.\d{1,2})?$/.test(d.amount)||!plain(d.detail)||!plain(d.request)||d.website!==''||typeof d.botToken!=='string'||d.botToken.length>2048)return reply(400,{error:'INVALID'});
 if(local&&!d.email.endsWith('.invalid'))return reply(400,{error:'SYNTHETIC_ONLY'});
 if(!local&&!recipientAllowed(env,d.email))return reply(403,{error:'CONTROLLED_ONLY'});
 const bucket=await mac((request.headers.get('CF-Connecting-IP')||'unknown')+':'+Math.floor(Date.now()/600000),env.HMAC_SECRET);
 const limit=await env.DB.prepare('INSERT INTO complaint_limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(bucket,Date.now()+600000).first();
 if(limit.count>10)return reply(429,{error:'RATE'});
 if(!(local&&d.botToken==='LOCAL_SYNTHETIC_ONLY')){const v=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:d.botToken}),signal:AbortSignal.timeout(5000)}).then(r=>r.json());if(!v.success||v.action!=='complaints'||v.hostname!==new URL(origin).hostname)return reply(403,{error:'BOT'})}
 const {botToken,website,requestId,...payload}=d;
 const provider={name:env.PROVIDER_LEGAL_NAME,ruc:env.PROVIDER_RUC,address:env.PROVIDER_ADDRESS};
 const receiptFor=(row,state=row.state)=>{const number=String(row.id).padStart(8,'0');return {number,date:row.created,state,receipt:complaintReceipt(number,row.created,provider,payload)}};
 const fingerprint=await mac(JSON.stringify(payload),env.HMAC_SECRET);const old=await env.DB.prepare('SELECT id,fingerprint,created,state FROM complaints WHERE request_id=?').bind(requestId).first();if(old){if(old.fingerprint!==fingerprint)return reply(409,{error:'CONFLICT'});return reply(200,receiptFor(old))}
 const created=new Date().toISOString();const sealed=await encrypt(payload,env.ENCRYPTION_KEY);await env.DB.prepare("INSERT INTO complaints(request_id,fingerprint,payload,created,state) SELECT ?,?,?,?,'registered' WHERE NOT EXISTS(SELECT 1 FROM complaints WHERE request_id=?)").bind(requestId,fingerprint,sealed,created,requestId).run();const row=await env.DB.prepare('SELECT id,fingerprint,created,state FROM complaints WHERE request_id=?').bind(requestId).first();if(row.fingerprint!==fingerprint)return reply(409,{error:'CONFLICT'});
 try {
   const claimed=await env.DB.prepare("UPDATE complaints SET state='notifying' WHERE request_id=? AND state='registered'").bind(requestId).run();
   if(claimed.meta.changes!==1)return reply(200,receiptFor(row));
 } catch {
   return reply(201,receiptFor(row));
 }
 const copy=receiptFor(row);
 let state='notification_pending';
 if (canNotify) {
   async function send(to, textContent) {
     const response=await fetcher('https://api.brevo.com/v3/smtp/email',{
       method:'POST',
       headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json'},
       body:JSON.stringify({sender:{name:'JuanCa Power',email:'hola@juancapower.com'},to:[{email:to}],subject:'Hoja de Reclamación '+copy.number,textContent}),
       signal:AbortSignal.timeout(8000),
     });
     if(!response.ok)throw Error('PROVIDER');
   }
   const [owner,consumer]=await Promise.allSettled([
     send('hola@juancapower.com',`Nueva hoja ${copy.number}. Revisa el Libro por el canal interno autorizado.`),
     send(d.email,copy.receipt),
   ]);
   state=owner.status==='fulfilled'
     ? (consumer.status==='fulfilled'?'notified':'consumer_review')
     : (consumer.status==='fulfilled'?'owner_review':'notification_review');
 }
 try {
   await env.DB.prepare('UPDATE complaints SET state=? WHERE request_id=?').bind(state,requestId).run();
 } catch {
   // A confirmed registration still has a valid receipt. Reconcile the uncertain state manually.
   state='notifying';
 }
 return reply(201,{...copy,state});
 }catch{return reply(503,{error:'SERVICE'})}
}}
export default {fetch:createComplaints(),async scheduled(_event,env){if(env.DB)await env.DB.prepare('DELETE FROM complaint_limits WHERE expires<?').bind(Date.now()).run()}};
