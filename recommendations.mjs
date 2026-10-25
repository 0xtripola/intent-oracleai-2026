// Curated demo catalog. Only recommend items actually present in Maren & Co.
export const catalog = [
 {sku:'overshirt',name:'Linen overshirt',price:89,description:'Relaxed European flax linen overshirt; breathable layering for warm weather.',tags:['summer','vacation','travel','warm','breathable','linen','shirt','style','comfortable']},
 {sku:'knit',name:'Merino crew knit',price:98,description:'Mid-weight merino crew knit for cooler weather and layering.',tags:['cold','winter','warmth','knit','sweater','layer','travel']},
 {sku:'trouser',name:'Linen wide trouser',price:112,description:'Airy wide-leg linen trousers with a clean front.',tags:['summer','vacation','linen','pants','trouser','breathable','warm']},
 {sku:'tote',name:'Weekend tote',price:65,description:'Roomy waxed-canvas tote with internal zip pocket.',tags:['weekend','vacation','travel','bag','tote','carry','laptop']},
 {sku:'shoe',name:'Trail runner 2.0',price:129,description:'Trail shoes with breathable upper and grippy outsole.',tags:['hiking','trail','outdoor','running','shoe','walk','sport']},
 {sku:'rain',name:'Matte rain shell',price:149,description:'Waterproof breathable 2.5-layer shell with pit zips.',tags:['rain','waterproof','wet','storm','outdoor','jacket']},
 {sku:'pack',name:'Canvas day pack',price:74,description:'20L canvas backpack with padded sleeve.',tags:['backpack','bag','travel','commute','hiking','daypack']},
 {sku:'sock',name:'Alpine wool sock · 3-pack',price:28,description:'Cushioned merino-blend socks for outdoor comfort.',tags:['sock','hiking','trail','warm','comfort','outdoor']}
];
export function recommend(query, limit=3) {
 const q=String(query||'').toLowerCase();
 const budgetMatch=q.match(/(?:under|below|less than|within|budget(?: of)?|up to)\s*\$?\s*(\d{1,5})/i);
 const budget=budgetMatch?Number(budgetMatch[1]):null;
 const words=new Set(q.match(/[a-z]+/g)||[]);
 const matches=catalog.filter(p=>budget===null||p.price<=budget).map(p=>{
  const matched=p.tags.filter(t=>words.has(t));
  return {...p,score:matched.length,matched};
 }).filter(p=>p.score>0).sort((a,b)=>b.score-a.score||a.price-b.price).slice(0,limit);
 return matches.map(({score,matched,tags,...p})=>({...p,reason:matched.length?`Matches: ${matched.slice(0,3).join(', ')}`:'Catalog match'}));
}
