import test from 'node:test';
import assert from 'node:assert/strict';
import {forecast, inferPersona, selectProducts} from '../model.mjs';
test('revenue uses incremental percentage points, not all abandoned orders',()=>{
 assert.deepEqual(forecast(50000,2,100),{orders:1000,perShopper:2,monthly:100000,annual:1200000});
 assert.equal(forecast(-50,2,100).monthly,0);
 assert.equal(forecast(100,0,100).monthly,0);
});
test('sparse and conflicting evidence retains default experience',()=>{
 assert.equal(inferPersona([]).key,null);
 assert.equal(inferPersona([{type:'view'}]).key,null);
 assert.equal(inferPersona([{type:'gift'},{type:'compare'}]).key,null);
});
test('behavior updates intent and old evidence expires',()=>{
 assert.equal(inferPersona([{type:'price'},{type:'price'}]).key,'value');
 assert.equal(inferPersona([{type:'gift'},...Array.from({length:16},()=>({type:'compare'}))]).key,'researcher');
});
test('search, budget and persona ranking compose',()=>{
 const list=selectProducts({persona:'value',budget:70});
 assert.equal(list[0].id,'coffee'); assert.ok(list.every(p=>p.price<=70));
 assert.equal(selectProducts({persona:'direct',search:'wireless headphones'})[0].id,'headphones');
 assert.equal(selectProducts({search:'no such product'}).length,0);
});
test('gift occasion, recipient and delivery constraints change recommendations',()=>{
 assert.equal(selectProducts({persona:'gift',occasion:'New home'})[0].id,'lamp');
 assert.equal(selectProducts({persona:'gift',recipient:'A colleague'})[0].id,'coffee');
 assert.deepEqual(selectProducts({persona:'gift',delivery:3}).map(p=>p.id),['coffee','speaker']);
});
