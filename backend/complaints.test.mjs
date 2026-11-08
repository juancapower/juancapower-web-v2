import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {testDatabase,testEnv,mockProvider} from './testing.mjs';import worker,{createComplaints} from './complaints.mjs';
const fixture=()=>({requestId:crypto.randomUUID(),name:'Consumidor sintético',documentType:'DNI',documentNumber:'00000000',address:'Dirección sintética NO REAL',email:'complaint@example.invalid',phone:'+51000000000',minor:false,guardian:'',kind:'Reclamo',service:'Servicio sintético',amount:'0',detail:'Caso sintético',request:'Revisión sintética',website:'',botToken:'LOCAL_SYNTHETIC_ONLY'});
function setup(){const store=testDatabase();store.sql.exec(readFileSync(new URL('./complaints-schema.sql',import.meta.url),'utf8'));const provider=mockProvider();const env={...testEnv(store.db),COMPLAINTS_ENABLED:'true',LEGAL_APPROVED:'true',PROVIDER_LEGAL_NAME:'Prestador sintético NO REAL',PROVIDER_RUC:'00000000000',PROVIDER_ADDRESS:'Dirección sintética',COMPLAINTS_RETENTION_APPROVED:'TEST_ONLY'};const handle=createComplaints({fetcher:provider.fetcher,synthetic:true});const send=(d,headers={})=>handle(new Request('http://127.0.0.1:4323/v1/complaints',{method:'POST',headers:{Origin:env.ALLOWED_ORIGINS,'Content-Type':'application/json',...headers},body:JSON.stringify(d)}),env);return {store,provider,env,handle,send}}
test('durable correlativo, encrypted complaint, copy and idempotent notices',async()=>{const t=setup();const d=fixture();const r=await t.send(d);assert.equal(r.status,201);const copy=await r.json();assert.equal(copy.number,'00000001');assert.equal(copy.provider.ruc,'00000000000');assert.equal(t.provider.calls.length,2);assert.equal(t.provider.calls[1].body.to[0].email,d.email);assert(t.provider.calls[1].body.textContent.includes(d.detail));assert(t.provider.calls[1].body.textContent.includes("Acciones u observaciones del proveedor"));const row=t.store.sql.prepare('SELECT * FROM complaints').get();assert(!row.payload.includes(d.name));assert.equal((await t.send(d)).status,200);assert.equal(t.provider.calls.length,2);assert.equal((await t.send({...d,detail:'Changed'})).status,409);const next=await(await t.send(fixture())).json();assert.equal(next.number,'00000002')});
test('failure retains registered copy and retries never resend',async()=>{const t=setup();t.provider.setFailure('all');const d=fixture();const r=await t.send(d);assert.equal(r.status,201);assert.equal((await r.json()).state,'notification_review');await t.send(d);assert.equal(t.provider.calls.length,2)});
test('invalid inputs and no marketing or recipients accepted',async()=>{const t=setup();for(const patch of [{name:''},{email:'bad'},{website:'bot'},{to:'attacker@example.invalid'},{marketing:true},{minor:true,guardian:''},{detail:'<script>'},{amount:'-1'},{email:'real@example.com'}])assert.equal((await t.send({...fixture(),...patch})).status,400);assert.equal(t.provider.calls.length,0)});
test('origin, abuse and disabled flags protect real handler',async()=>{const t=setup();assert.equal((await t.send(fixture(),{Origin:'https://evil.invalid'})).status,403);t.env.COMPLAINTS_ENABLED='false';assert.equal((await t.send(fixture())).status,503);t.env.COMPLAINTS_ENABLED='true';assert.equal((await worker.fetch(new Request('http://127.0.0.1:4323/v1/complaints',{method:'POST',headers:{Origin:t.env.ALLOWED_ORIGINS}}),t.env)).status,503);for(let i=0;i<10;i++)await t.send(fixture());assert.equal((await t.send(fixture())).status,429)});


test('missing Brevo credentials keeps the confirmed receipt and never calls mail',async()=>{
 const t=setup();delete t.env.BREVO_API_KEY;const d=fixture();
 const first=await t.send(d);assert.equal(first.status,201);
 const copy=await first.json();assert.equal(copy.state,'notification_pending');assert.match(copy.receipt,/00000001/);
 const retry=await t.send(d);assert.equal(retry.status,200);assert.deepEqual(await retry.json(),copy);
 assert.equal(t.store.sql.prepare('SELECT count(*) AS n FROM complaints').get().n,1);
 assert.equal(t.provider.calls.length,0);
});

test('failed operator alert still attempts and retains the consumer copy',async()=>{
 const t=setup();const calls=[];
 const handle=createComplaints({synthetic:true,fetcher:async(_url,opts)=>{
  const message=JSON.parse(opts.body);calls.push(message);
  if(message.to[0].email==='hola@juancapower.com')throw Error('TIMEOUT');
  return Response.json({messageId:'test'},{status:201});
 }});
 const d=fixture();const request=new Request('http://127.0.0.1:4323/v1/complaints',{method:'POST',
  headers:{Origin:t.env.ALLOWED_ORIGINS,'Content-Type':'application/json'},body:JSON.stringify(d)});
 const response=await handle(request,t.env);assert.equal(response.status,201);
 const copy=await response.json();
 assert.equal(copy.state,'owner_review');
 assert(!calls[0].textContent.includes(d.detail));assert.equal(calls[1].textContent,copy.receipt);
});

test('production verifies action and exact Origin hostname, and readiness is read-only',async()=>{
 const t=setup();
 const env={...t.env,TEST_MODE:'',CONTROLLED_TEST_ONLY:'false',COMPLAINTS_RETENTION_APPROVED:'true',TURNSTILE_SECRET:'synthetic',ALLOWED_ORIGINS:'https://www.juancapower.com,https://juancapower.github.io'};
 let verification={success:true,action:'complaints',hostname:'juancapower.github.io'};
 let verificationCalls=0;
 const handle=createComplaints({fetcher:async()=>{
  verificationCalls++;return Response.json(verification);
 }});
 const endpoint='https://example.invalid/v1/complaints';
 const headers={Origin:'https://www.juancapower.com','Content-Type':'application/json'};
 const send=()=>handle(new Request(endpoint,{method:'POST',headers,body:JSON.stringify(fixture())}),env);
 assert.equal((await send()).status,403);
 verification={...verification,hostname:'www.juancapower.com',action:'power4'};
 assert.equal((await send()).status,403);
 verification={...verification,action:'complaints'};
 const registered=await send();assert.equal(registered.status,201);assert.equal((await registered.json()).state,'notification_pending');
 const health=()=>handle(new Request(endpoint+'/health',{headers}),env);
 assert.equal((await health()).status,503);
 env.LIVE_SENDS_ENABLED='true';
 assert.deepEqual(await(await health()).json(),{status:'READY',version:2});
 assert.equal(verificationCalls,3);
 assert.equal(t.store.sql.prepare('SELECT count(*) AS n FROM complaints').get().n,1);
});

test('a failed status update after registration cannot erase the receipt or trigger a duplicate send',async()=>{
 const t=setup();const prepare=t.env.DB.prepare.bind(t.env.DB);
 t.env.DB={...t.env.DB,prepare(query){
   if(query.startsWith('UPDATE complaints SET state=?'))throw Error('TEST_OUTAGE');
   return prepare(query);
 }};
 const data=fixture();const first=await t.send(data);
 assert.equal(first.status,201);assert.equal((await first.json()).state,'notifying');
 assert.equal((await t.send(data)).status,200);assert.equal(t.provider.calls.length,2);
});

test('simultaneous retries allocate one correlativo and leave the next one sequential',async()=>{
 const t=setup();const d=fixture();
 const results=await Promise.all([t.send(d),t.send(d)]);
 assert.deepEqual((await Promise.all(results.map(r=>r.json()))).map(r=>r.number),['00000001','00000001']);
 assert.equal(t.provider.calls.length,2);
 assert.equal((await(await t.send(fixture())).json()).number,'00000002');
});
