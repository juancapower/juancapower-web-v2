// No contiene secretos. Impide abrir el servicio por omisión de una decisión de publicación.
export function releaseAvailable(env, now=Date.now()) {
 if(env.CONTROLLED_TEST_ONLY==='false') return true;
 if(env.CONTROLLED_TEST_ONLY!=='true') return false;
 const from=Date.parse(env.CONTROLLED_TEST_FROM||''),until=Date.parse(env.CONTROLLED_TEST_UNTIL||'');
 return Number.isFinite(from)&&Number.isFinite(until)&&from<=now&&until>now&&until>from&&until-from<=3600000&&!!env.CONTROLLED_TEST_EMAILS?.trim();
}
export function recipientAllowed(env,email) {
 if(env.CONTROLLED_TEST_ONLY==='false')return true;
 if(env.CONTROLLED_TEST_ONLY!=='true'||typeof email!=='string')return false;
 return (env.CONTROLLED_TEST_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean).includes(email.trim().toLowerCase());
}
