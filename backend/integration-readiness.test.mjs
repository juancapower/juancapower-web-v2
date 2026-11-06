import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {releaseAvailable,recipientAllowed} from './release-gate.mjs';
import {createHandler} from './worker.mjs';
import {createComplaints} from './complaints.mjs';
import {testDatabase,testEnv,mockProvider} from './testing.mjs';

test('controlled release requires an explicit mode, recipients and a maximum one-hour window',()=>{
 const now=Date.now(),env={CONTROLLED_TEST_ONLY:'true',CONTROLLED_TEST_FROM:new Date(Date.now()-1000).toISOString(),CONTROLLED_TEST_UNTIL:new Date(now+1800000).toISOString(),CONTROLLED_TEST_EMAILS:'operator@example.invalid'};
 assert.equal(releaseAvailable(env,now),true);
 for(const patch of [{CONTROLLED_TEST_FROM:undefined},{CONTROLLED_TEST_FROM:new Date(now+1).toISOString()},{CONTROLLED_TEST_ONLY:undefined},{CONTROLLED_TEST_ONLY:'yes'},{CONTROLLED_TEST_EMAILS:''},{CONTROLLED_TEST_UNTIL:'invalid'},{CONTROLLED_TEST_UNTIL:new Date(now-1).toISOString()},{CONTROLLED_TEST_UNTIL:new Date(now+3600001).toISOString()}])assert.equal(releaseAvailable({...env,...patch},now),false);
 assert.equal(recipientAllowed(env,' Operator@Example.Invalid '),true);
 assert.equal(recipientAllowed(env,'other@example.invalid'),false);
 assert.equal(releaseAvailable({CONTROLLED_TEST_ONLY:'false'}),true);
});

test('production handlers stop before DB and network if release approval is missing',async()=>{
 let touches=0;const db=new Proxy({},{get(){touches++;throw Error('No DB allowed')}});
 for(const [handler,route,extra] of [[createHandler(),'/v1/power4/challenge',{CAPTURE_ENABLED:'true',PRIVACY_APPROVED:'true'}],[createComplaints(),'/v1/complaints',{COMPLAINTS_ENABLED:'true',LEGAL_APPROVED:'true'}]]){
 const result=await handler(new Request('https://fixture.invalid'+route,{method:'POST',headers:{Origin:'https://juancapower.github.io'}}),{...extra,LIVE_SENDS_ENABLED:'true',ALLOWED_ORIGINS:'https://juancapower.github.io',DB:db});
 assert.equal(result.status,503);assert.deepEqual(await result.json(),{error:'RELEASE_NOT_APPROVED'});
 }assert.equal(touches,0);
});

function setup(){
 const store=testDatabase();store.sql.exec(readFileSync(new URL('./complaints-schema.sql',import.meta.url),'utf8'));const provider=mockProvider();let verifications=0;
 const env={...testEnv(store.db),TEST_MODE:'',LIVE_SENDS_ENABLED:'true',COMPLAINTS_ENABLED:'true',LEGAL_APPROVED:'true',ALLOWED_ORIGINS:'https://juancapower.github.io',PRIVACY_VERSION:'QA_FIXTURE_ONLY',CONTROLLED_TEST_ONLY:'true',CONTROLLED_TEST_FROM:new Date(Date.now()-1000).toISOString(),CONTROLLED_TEST_UNTIL:new Date(Date.now()+1800000).toISOString(),CONTROLLED_TEST_EMAILS:'operator@example.invalid',TURNSTILE_SECRET:'SYNTHETIC_NOT_A_SECRET',PROVIDER_LEGAL_NAME:'Prestador sintético',PROVIDER_RUC:'00000000000',PROVIDER_ADDRESS:'Dirección sintética',COMPLAINTS_RETENTION_APPROVED:'true',BREVO_LIST_ID:'15',BREVO_MARKETING_LIST_ID:'16'};
 const fetcher=async(url,options)=>{if(url==='https://challenges.cloudflare.com/turnstile/v0/siteverify'){verifications++;return Response.json({success:true,action:env.testAction||'power4',hostname:'juancapower.github.io'})}return provider.fetcher(url,options)};
 const power4=createHandler({fetcher}),complaints=createComplaints({fetcher});
 const call=(path,data)=>{const request=new Request('https://fixture.invalid'+path,{method:'POST',headers:{Origin:env.ALLOWED_ORIGINS,'Content-Type':'application/json'},body:JSON.stringify(data)});return (path==='/v1/complaints'?complaints:power4)(request,env)};
 return {store,provider,env,call,verifications:()=>verifications};
}
async function payload(t){const challenge=await(await t.call('/v1/power4/challenge',{})).json();return {requestId:crypto.randomUUID(),nonce:challenge.nonce,botToken:'SYNTHETIC_PROOF',website:'',contact:{name:'Persona sintética',email:'operator@example.invalid'},consent:{contact:true,shareScores:true,marketing:false,version:t.env.PRIVACY_VERSION,textHash:challenge.consentHash},scores:{spirit:12,mind:12,body:12,emotion:12}}}

test('controlled POWER4 rejects other recipients before Siteverify and CRM, then processes authorized fixture once',async()=>{
 const t=setup(),p=await payload(t);p.contact.email='other@example.invalid';assert.equal((await t.call('/v1/power4/requests',p)).status,403);assert.equal(t.verifications(),0);assert.equal(t.store.sql.prepare('SELECT COUNT(*) n FROM requests').get().n,0);assert.equal(t.provider.calls.length,0);
 p.contact.email='operator@example.invalid';assert.equal((await t.call('/v1/power4/requests',p)).status,200);assert.deepEqual(t.provider.calls[0].body.listIds,[15]);assert.equal(t.provider.calls[0].body.attributes.POWER4_CONTACT_CONSENT,true);assert(!JSON.stringify(t.provider.calls[0]).includes('spirit'));assert.equal(t.provider.calls.length,2);assert(t.provider.calls[1].body.textContent.includes('12/20'));
 p.nonce=(await(await t.call('/v1/power4/challenge',{})).json()).nonce;await t.call('/v1/power4/requests',p);assert.equal(t.provider.calls.length,2);t.store.sql.close();
});

test('controlled complaint preserves correlativo and copy without adding a contact to CRM',async()=>{
 const t=setup();t.env.testAction='complaints';const p={requestId:crypto.randomUUID(),name:'Consumidor sintético',documentType:'DNI',documentNumber:'00000000',address:'Dirección sintética',email:'other@example.invalid',phone:'+51000000000',minor:false,guardian:'',kind:'Reclamo',service:'Servicio sintético',amount:'0',detail:'Caso sintético',request:'Revisión sintética',website:'',botToken:'SYNTHETIC_PROOF'};
 assert.equal((await t.call('/v1/complaints',p)).status,403);assert.equal(t.verifications(),0);assert.equal(t.store.sql.prepare('SELECT COUNT(*) n FROM complaints').get().n,0);
 p.email='operator@example.invalid';const result=await(await t.call('/v1/complaints',p)).json();assert.equal(result.number,'00000001');assert.equal(t.provider.calls.length,2);assert(t.provider.calls.every(x=>x.path.endsWith('/smtp/email')));await t.call('/v1/complaints',p);assert.equal(t.provider.calls.length,2);t.store.sql.close();
});

test('separate Brevo lists and an explicit complaints retention approval are required',async()=>{
 const t=setup();t.env.BREVO_MARKETING_LIST_ID='15';assert.equal((await t.call('/v1/power4/challenge',{})).status,503);assert.equal(t.provider.calls.length,0);
 t.env.BREVO_MARKETING_LIST_ID='16';t.env.testAction='complaints';t.env.COMPLAINTS_RETENTION_APPROVED='false';const r=await t.call('/v1/complaints',{});assert.equal(r.status,503);assert.deepEqual(await r.json(),{error:'CONFIG'});assert.equal(t.provider.calls.length,0);t.store.sql.close();
});
