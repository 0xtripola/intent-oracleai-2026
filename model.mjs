export const personas = {
  value: { name: 'Value seeker', short: 'Value seekers', icon: 'tag', color: '#df8f49', description: 'A good find. An even better price.', signal: 'Uses price filters and explores affordable options', action: 'Value-first ranking · clear total prices' },
  researcher: { name: 'Researcher', short: 'Researchers', icon: 'search', color: '#8c82c2', description: 'Good decisions start with the details.', signal: 'Compares products and spends time on specifications', action: 'Detailed specifications · product comparisons' },
  direct: { name: 'Knows what they want', short: 'Focused shoppers', icon: 'target', color: '#69a99e', description: 'Your next favorite. Found faster.', signal: 'Searches for specific products and returns to favorites', action: 'Precise matches · availability · quick add' },
  gift: { name: 'Gift shopper', short: 'Gift shoppers', icon: 'gift', color: '#dc8d9c', description: 'Thoughtful finds for your favorite people.', signal: 'Searches for gifts, occasions, and delivery information', action: 'Gift-ready picks · budget · delivery guidance' },
};
export const products = [
 { id:'headphones', name:'Studio Wireless Headphones', category:'Tech', price:129, rating:4.9, reviews:248, color:'Sand / Slate', image:'photo-1546435770-a3e426bf472b', tag:'Bestseller', gift: true, spec:'40-hour battery · Active noise cancellation', description:'A little less noise. A lot more focus. Comfortable wireless headphones for your everyday soundtrack.' },
 { id:'lamp', name:'Arc Table Lamp', category:'Home', price:68, rating:4.8, reviews:126, color:'Soft white', image:'photo-1507473885765-e6ed057f782c', tag:'A warmer home', gift:true, spec:'Dimmable LED · Warm 2700K light', description:'A soft pool of light for slow evenings and well-loved reading corners.' },
 { id:'bag', name:'Everyday Carry Backpack', category:'Lifestyle', price:89, rating:4.9, reviews:312, color:'Forest / Black', image:'photo-1553062407-98eeb64c6a62', tag:'Everyday essential', gift:false, spec:'18L capacity · Recycled fabric · Laptop sleeve', description:'Room for the essentials, built for whatever the day brings. Your commute just got a little lighter.' },
 { id:'coffee', name:'Slow Morning Coffee Set', category:'Home', price:42, rating:4.8, reviews:184, color:'Natural ceramic', image:'photo-1495474472287-4d71bcdd2085', tag:'Under $50', gift:true, spec:'2 ceramic cups · Dishwasher safe · Gift box', description:'Make a small ritual of the everyday. Two beautifully simple cups, ready to share.' },
 { id:'watch', name:'Minimal Everyday Watch', category:'Lifestyle', price:95, rating:4.7, reviews:97, color:'Warm brown', image:'photo-1524805444758-089113d48a6d', tag:'Timeless design', gift:true, spec:'38mm case · Japanese quartz · 3 ATM', description:'Clean lines and thoughtful details. An understated companion for every occasion.' },
 { id:'speaker', name:'Portable Sound Speaker', category:'Tech', price:59, rating:4.8, reviews:203, color:'Graphite', image:'photo-1608043152269-423dbba4e7e1', tag:'Small but mighty', gift:true, spec:'12-hour battery · Bluetooth · Splash resistant', description:'Your favorite sounds, wherever you land. Surprisingly rich audio in a compact design.' }
];
export function forecast(shoppers, recoveryPercent, aov) {
  const n = Math.max(0, Number(shoppers) || 0), rate = Math.min(100, Math.max(0, Number(recoveryPercent) || 0)) / 100, value = Math.max(0, Number(aov) || 0);
  return { orders:n * rate, perShopper:rate * value, monthly:n * rate * value, annual:n * rate * value * 12 };
}
export function inferPersona(events) {
  const scores = {value:0, researcher:0, direct:0, gift:0};
  for (const event of events.slice(-16)) {
    if (event.type === 'price') scores.value += 3;
    if (event.type === 'compare') scores.researcher += 4;
    if (event.type === 'dwell') scores.researcher += 2;
    if (event.type === 'return') scores.direct += 2;
    if (event.type === 'view') scores.direct += 0.4;
    if (event.type === 'gift') scores.gift += 4;
    if (event.type === 'search') {
      if (/gift|birthday|anniversary|mom|dad|present/i.test(event.value)) scores.gift += 4;
      else if (/cheap|budget|deal|affordable|under/i.test(event.value)) scores.value += 3;
      else if (event.value.trim().length > 2) scores.direct += 3;
    }
  }
  const ranked = Object.entries(scores).sort((a,b) => b[1]-a[1]);
  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  const confidence = total ? Math.round((ranked[0][1]/total) * Math.min(1, total/6) * 100) : 0;
  return { key: confidence >= 60 ? ranked[0][0] : null, confidence, scores };
}
export function selectProducts({persona, search='', category='All', budget=200, recipient='Someone special', occasion='Just because', delivery=7}) {
  let list = products.filter(p => (category === 'All' || p.category === category) && p.price <= budget);
  const terms = search.toLowerCase().split(/\s+/).filter(t=>t && !['gift','gifts','for','a','the','birthday','mom','dad','under','budget'].includes(t) && !/^\d+$/.test(t));
  if (terms.length) list = list.filter(p => terms.every(t => `${p.name} ${p.category} ${p.spec}`.toLowerCase().includes(t)));
  if (persona === 'value') list.sort((a,b)=>a.price-b.price);
  if (persona === 'researcher') list.sort((a,b)=>b.reviews-a.reviews);
  if (persona === 'gift') {
    const days = {headphones:5,lamp:5,bag:7,coffee:3,watch:5,speaker:3};
    const recipientPicks = {'A friend':['speaker','headphones'], 'A parent':['coffee','lamp'], 'A colleague':['coffee','watch']};
    const occasionPicks = {'Birthday':['watch','headphones'], 'Thank you':['coffee','speaker'], 'New home':['lamp','coffee']};
    const score = p => Number(p.gift) * 5 + (recipientPicks[recipient]?.includes(p.id) ? 2 : 0) + (occasionPicks[occasion]?.includes(p.id) ? 3 : 0);
    list = list.filter(p=>days[p.id] <= delivery).sort((a,b)=>score(b)-score(a));
  }
  return list;
}
