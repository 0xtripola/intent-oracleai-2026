import test from 'node:test';
import assert from 'node:assert/strict';
import {recommend} from '../recommendations.mjs';
test('summer under $100 recommends actual affordable products',()=>{
 const results=recommend('breathable summer vacation under $100');
 assert.ok(results.some(p=>p.sku==='overshirt'));
 assert.ok(results.every(p=>p.price<=100));
 assert.ok(results.every(p=>p.sku && p.name && p.reason));
});
test('rainy weekend selects rain shell',()=>assert.equal(recommend('rain waterproof jacket')[0].sku,'rain'));
