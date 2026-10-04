// v1.1's anonymous-profile contract is intentionally removed.
// Full authenticated film/ownership/recovery assertions live in auth.test.mjs.
import test from 'node:test';import assert from 'node:assert/strict';
test('legacy anonymous cookie cannot authorize the journal API',async()=>{const r=await fetch((process.env.TEST_URL||'http://localhost:3000')+'/api/state',{headers:{Cookie:'af_session='+'a'.repeat(64)}});assert.equal(r.status,401);assert.equal((await r.json()).code,'AUTH_REQUIRED');assert.equal(r.headers.getSetCookie().some(c=>c.startsWith('af_session=')),false)});
