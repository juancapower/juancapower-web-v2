export const leanRelease = import.meta.env.GO_LIVE_LEAN === '1';
export const leanRehearsal = leanRelease && import.meta.env.LEAN_REHEARSAL === '1';
