import test from 'node:test';
import assert from 'node:assert/strict';
import power4 from './worker.mjs';
import complaints from './complaints.mjs';
for(const [name,worker,route,flags] of [
 ['power4',power4,'/v1/power4/requests',['CAPTURE_ENABLED','PRIVACY_APPROVED','LIVE_SENDS_ENABLED']],
 ['complaints',complaints,'/v1/complaints',['COMPLAINTS_ENABLED','LEGAL_APPROVED','LIVE_SENDS_ENABLED']]
])test(`${name}: every disabled flag stops before DB or outbound calls`,async()=>{
 let touched=0;const db=new Proxy({},{get(){touched++;throw Error('DB must not be touched')}});
 const previous=globalThis.fetch;globalThis.fetch=async()=>{touched++;throw Error('Network forbidden')};
 try{for(const disabled of flags){const env={ALLOWED_ORIGINS:'https://juancapower.github.io',DB:db,...Object.fromEntries(flags.map(f=>[f,'true'])),[disabled]:'false'};const response=await worker.fetch(new Request('https://example.invalid'+route,{method:'POST',headers:{Origin:env.ALLOWED_ORIGINS,'Content-Type':'application/json'},body:'{}'}),env);assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:'DISABLED'});assert.equal(touched,0)}}finally{globalThis.fetch=previous}
});
