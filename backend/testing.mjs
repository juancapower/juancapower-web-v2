import {DatabaseSync} from 'node:sqlite';import {readFileSync} from 'node:fs';
export function testDatabase(){
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
 const db={
  prepare(query){
   return {bind(...params){return {
    async first(){return sql.prepare(query).get(...params)||null},
    async run(){const r=sql.prepare(query).run(...params);return {meta:{changes:Number(r.changes)}}}
   }}}
  },
  async batch(items){for(const i of items)await i.run()}
 };
 return {db,sql};
}
export function testEnv(db){return {DB:db,TEST_MODE:'local',CAPTURE_ENABLED:'true',PRIVACY_APPROVED:'true',LIVE_SENDS_ENABLED:'false',HMAC_SECRET:'synthetic-test-key-not-used-in-production-000',ENCRYPTION_KEY:'0'.repeat(64),ALLOWED_ORIGINS:'http://127.0.0.1:4323',PRIVACY_VERSION:'TEST_ONLY_2026_11',LEDGER_RETENTION_DAYS:'1',RATE_MAX:'10000',EMAIL_RATE_MAX:'10000',BREVO_LIST_ID:'42',BREVO_MARKETING_LIST_ID:'43',BREVO_DOI_TEMPLATE_ID:'7',DOI_REDIRECT_URL:'https://example.invalid/confirmed',BREVO_API_KEY:'SYNTHETIC_NOT_A_REAL_KEY'};}
export function mockProvider(){const calls=[];let failure='';return {calls,setFailure(value){failure=value},async fetcher(url,options){if(!url.startsWith('https://api.brevo.com/v3/'))throw Error('UNEXPECTED_NETWORK');const body=JSON.parse(options.body);calls.push({path:new URL(url).pathname,body});if(failure==='all'||(failure==='notice'&&url.endsWith('/smtp/email')))throw Error('SYNTHETIC_TIMEOUT');return Response.json(url.endsWith('/smtp/email')?{messageId:'synthetic'}:{id:123},{status:201})}};}
