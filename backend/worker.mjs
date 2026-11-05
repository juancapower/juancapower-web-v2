import consentTexts from './consent-texts.json' with {type:'json'};
import {BrevoAdapter} from './brevo.mjs';
const encoder=new TextEncoder();
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const bytes=s=>Uint8Array.from(s.match(/../g)||[],x=>parseInt(x,16));
const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
async function hmac(value,key){const k=await crypto.subtle.importKey('raw',encoder.encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',k,encoder.encode(value)));}
async function verifyMAC(value,mac,key){if(!/^[a-f0-9]{64}$/.test(mac||''))return false;const k=await crypto.subtle.importKey('raw',encoder.encode(key),{name:'HMAC',hash:'SHA-256'},false,['verify']);return crypto.subtle.verify('HMAC',k,bytes(mac),encoder.encode(value));}
async function seal(value,key){const iv=crypto.getRandomValues(new Uint8Array(12));const k=await crypto.subtle.importKey('raw',bytes(key),'AES-GCM',false,['encrypt']);return hex(iv)+':'+hex(await crypto.subtle.encrypt({name:'AES-GCM',iv},k,encoder.encode(JSON.stringify(value))));}
function strictKeys(value,keys){return value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(k=>keys.includes(k));}
function validate(d,env,consentHash){
 if(!strictKeys(d,['requestId','nonce','botToken','contact','consent','scores','website'])||!uuid.test(d.requestId)||!uuid.test(d.nonce)||typeof d.botToken!=='string'||d.botToken.length>2048||d.website!=='')return false;
 if(!strictKeys(d.contact,['name','email','phone'])||!strictKeys(d.consent,['contact','shareScores','marketing','version','textHash']))return false;
 const c=d.contact;if(typeof c.name!=='string'||c.name.trim().length<2||c.name.length>120||/[<>\x00-\x1f\x7f]/.test(c.name))return false;
 if(typeof c.email!=='string'||c.email.length>254||!/^([^\s@<>]+)@([^\s@<>]+)\.([^\s@<>]+)$/.test(c.email)||/[\r\n]/.test(c.email))return false;
 if(c.phone!==undefined&&c.phone!==''&&(typeof c.phone!=='string'||!/^\+[1-9][0-9]{7,14}$/.test(c.phone)))return false;
 if(d.consent.contact!==true||typeof d.consent.shareScores!=='boolean'||typeof d.consent.marketing!=='boolean'||d.consent.version!==env.PRIVACY_VERSION||d.consent.textHash!==consentHash)return false;
 if(d.consent.shareScores){if(!strictKeys(d.scores,['spirit','mind','body','emotion'])||Object.keys(d.scores).length!==4||!Object.values(d.scores).every(v=>Number.isInteger(v)&&v>=4&&v<=20))return false;}else if(d.scores!==undefined)return false;
 return true;
}
export function createHandler({fetcher=fetch,synthetic=false}={}){return async function handle(request,env){
 const url=new URL(request.url);const origin=request.headers.get('Origin');const allowed=(env.ALLOWED_ORIGINS||'').split(',');const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
 if(origin&&allowed.includes(origin))headers['Access-Control-Allow-Origin']=origin;
 const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
 if(!origin||!allowed.includes(origin))return reply(403,{error:'ORIGIN'});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'}});
 const local=synthetic&&fetcher!==globalThis.fetch&&env.TEST_MODE==='local'&&['127.0.0.1','localhost'].includes(url.hostname);
 if(env.CAPTURE_ENABLED!=='true'||env.PRIVACY_APPROVED!=='true'||(!local&&env.LIVE_SENDS_ENABLED!=='true'))return reply(503,{error:'DISABLED'});
 if(!env.DB||!env.HMAC_SECRET||env.HMAC_SECRET.length<32||!/^[0-9a-f]{64}$/i.test(env.ENCRYPTION_KEY||'')||!env.PRIVACY_VERSION||!Number(env.LEDGER_RETENTION_DAYS)||!Number(env.BREVO_LIST_ID)||!env.BREVO_API_KEY)return reply(503,{error:'NOT_CONFIGURED'});
 if(!local&&/^(PENDING|DRAFT|TEST)/i.test(env.PRIVACY_VERSION))return reply(503,{error:'PRIVACY_PENDING'});
 const retention=Number(env.LEDGER_RETENTION_DAYS);if(!Number.isInteger(retention)||retention<1||retention>3650)return reply(503,{error:'RETENTION_CONFIG'});
 const max=Number(env.RATE_MAX||30),emailMax=Number(env.EMAIL_RATE_MAX||3);if(!Number.isInteger(max)||max<1||!Number.isInteger(emailMax)||emailMax<1)return reply(503,{error:'RATE_CONFIG'});
 const db=env.DB;const now=Date.now();const consentHash=hex(await crypto.subtle.digest('SHA-256',encoder.encode(JSON.stringify(consentTexts))));
 try{
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';const rateKey=await hmac('ip:'+ip+':'+Math.floor(now/600000),env.HMAC_SECRET);const rate=await db.prepare('INSERT INTO limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(rateKey,now+600000).first();
 if(rate.count>Number(env.RATE_MAX||30))return reply(429,{error:'RATE_LIMIT'});
 if(url.pathname==='/v1/power4/challenge'&&request.method==='POST'){const nonce=crypto.randomUUID();await db.prepare('INSERT INTO nonces(token,expires) VALUES(?,?)').bind(await hmac(nonce,env.HMAC_SECRET),now+300000).run();return reply(200,{nonce,privacyVersion:env.PRIVACY_VERSION,consentHash});}
 if(url.pathname==='/v1/power4/status'&&request.method==='GET'){const token=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');const [id,mac]=token.split('.');if(!uuid.test(id)||!await verifyMAC('status:'+id,mac,env.HMAC_SECRET))return reply(403,{error:'TOKEN'});const row=await db.prepare('SELECT state,ledger_expires FROM requests WHERE id=?').bind(id).first();return row&&row.ledger_expires>now?reply(200,{state:row.state}):reply(404,{error:'NOT_FOUND'});}
 if(url.pathname!=='/v1/power4/requests'||request.method!=='POST')return reply(404,{error:'NOT_FOUND'});
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return reply(415,{error:'JSON_REQUIRED'});
 if(Number(request.headers.get('Content-Length')||0)>8192)return reply(413,{error:'SIZE'});
 let raw='';let size=0;const decoder=new TextDecoder();const reader=request.body?.getReader();if(!reader)return reply(400,{error:'INVALID'});for(;;){const item=await reader.read();if(item.done)break;size+=item.value.byteLength;if(size>8192){await reader.cancel();return reply(413,{error:'SIZE'})}raw+=decoder.decode(item.value,{stream:true})}raw+=decoder.decode();let data;try{data=JSON.parse(raw)}catch{return reply(400,{error:'INVALID'})}
 if(!validate(data,env,consentHash))return reply(400,{error:'INVALID'});
 if(local&&!data.contact.email.endsWith('.invalid'))return reply(400,{error:'SYNTHETIC_ONLY'});
 if(data.consent.marketing&&(!Number(env.BREVO_MARKETING_LIST_ID)||!Number(env.BREVO_DOI_TEMPLATE_ID)||!/^https:\/\//.test(env.DOI_REDIRECT_URL||'')))return reply(503,{error:'MARKETING_NOT_CONFIGURED'});
 const key=await hmac(data.nonce,env.HMAC_SECRET);const nonce=await db.prepare('SELECT expires,used FROM nonces WHERE token=?').bind(key).first();if(!nonce||nonce.used||nonce.expires<now)return reply(403,{error:'NONCE'});
 if(!(local&&data.botToken==='LOCAL_SYNTHETIC_ONLY')){if(!env.TURNSTILE_SECRET)return reply(503,{error:'ANTISPAM_NOT_CONFIGURED'});let verification;try{const r=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:data.botToken}),signal:AbortSignal.timeout(5000)});verification=await r.json()}catch{return reply(503,{error:'ANTISPAM_UNAVAILABLE'})}if(!verification.success||verification.action!=='power4'||!allowed.some(o=>new URL(o).hostname===verification.hostname))return reply(403,{error:'ANTISPAM'});}
 const consumed=await db.prepare('UPDATE nonces SET used=1 WHERE token=? AND used=0 AND expires>?').bind(key,now).run();if(consumed.meta.changes!==1)return reply(403,{error:'NONCE'});
 const payload={contact:{name:data.contact.name.trim(),email:data.contact.email.trim(),...(data.contact.phone?{phone:data.contact.phone}:{})},consent:{contact:true,shareScores:data.consent.shareScores,marketing:data.consent.marketing,version:data.consent.version,textHash:consentHash},...(data.consent.shareScores?{scores:{spirit:data.scores.spirit,mind:data.scores.mind,body:data.scores.body,emotion:data.scores.emotion}}:{})};
 const fingerprint=await hmac(JSON.stringify(payload),env.HMAC_SECRET);const token=data.requestId+'.'+await hmac('status:'+data.requestId,env.HMAC_SECRET);
 const old=await db.prepare('SELECT fingerprint,state,payload_expires FROM requests WHERE id=?').bind(data.requestId).first();if(old){if(old.fingerprint!==fingerprint)return reply(409,{error:'IDEMPOTENCY_CONFLICT'});return reply(200,{state:old.state,statusToken:token});}
 const emailRateKey=await hmac('email:'+payload.contact.email.toLowerCase()+':'+Math.floor(now/86400000),env.HMAC_SECRET);const emailRate=await db.prepare('INSERT INTO limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(emailRateKey,now+86400000).first();if(emailRate.count>Number(env.EMAIL_RATE_MAX||3))return reply(429,{error:'RATE_LIMIT'});
 const encrypted=await seal(payload,env.ENCRYPTION_KEY);const consent=JSON.stringify({version:env.PRIVACY_VERSION,contact:true,shareScores:data.consent.shareScores,marketing:data.consent.marketing,at:new Date(now).toISOString(),textHash:consentHash,texts:consentTexts});
 const insert=await db.prepare('INSERT OR IGNORE INTO requests(id,fingerprint,email_hash,consent,payload,state,created,payload_expires,ledger_expires) VALUES(?,?,?,?,?,?,?,?,?)').bind(data.requestId,fingerprint,await hmac(payload.contact.email.toLowerCase(),env.HMAC_SECRET),consent,encrypted,'prepared',now,now+86400000,now+Number(env.LEDGER_RETENTION_DAYS)*86400000).run();
 if(insert.meta.changes!==1){const existing=await db.prepare('SELECT fingerprint,state FROM requests WHERE id=?').bind(data.requestId).first();return existing.fingerprint===fingerprint?reply(200,{state:existing.state,statusToken:token}):reply(409,{error:'IDEMPOTENCY_CONFLICT'});}
 const lease=await db.prepare("UPDATE requests SET state='processing' WHERE id=? AND state='prepared'").bind(data.requestId).run();if(lease.meta.changes!==1)return reply(202,{state:'processing',statusToken:token});
 const provider=new BrevoAdapter(env,fetcher);const at=new Date(now).toISOString();
 try{await provider.contact(payload,data.requestId,at);await db.prepare("UPDATE requests SET state='contact_created' WHERE id=?").bind(data.requestId).run();if(payload.consent.marketing)await provider.marketing(payload);await db.prepare("UPDATE requests SET state='notification_pending' WHERE id=?").bind(data.requestId).run();await provider.notify(payload,data.requestId,at);await db.prepare("UPDATE requests SET state='processed',payload=NULL WHERE id=?").bind(data.requestId).run();return reply(200,{state:'processed',statusToken:token});}
 catch{await db.prepare("UPDATE requests SET state='review_required' WHERE id=?").bind(data.requestId).run();return reply(202,{state:'review_required',statusToken:token});}
 }catch{return reply(503,{error:'SERVICE_UNAVAILABLE'})}
};}
export default {fetch:createHandler(),async scheduled(_event,env){if(!env.DB)return;const now=Date.now();await env.DB.batch([env.DB.prepare('UPDATE requests SET payload=NULL WHERE payload_expires<?').bind(now),env.DB.prepare('DELETE FROM requests WHERE ledger_expires<?').bind(now),env.DB.prepare('DELETE FROM nonces WHERE expires<?').bind(now),env.DB.prepare('DELETE FROM limits WHERE expires<?').bind(now)]);}};
