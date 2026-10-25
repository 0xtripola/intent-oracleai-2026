// Server-side only. Never import this module in browser code.
const PRODUCTS = {
  overshirt: 'Linen overshirt', knit: 'Knit sweater', trouser: 'Trousers',
  tote: 'Tote bag', shoe: 'Shoes', rain: 'Rain jacket', pack: 'Backpack', sock: 'Socks'
};
const error = (status, publicMessage) => Object.assign(new Error(publicMessage), {status, publicMessage});
export async function handleChat(body) {
  if (!process.env.OPENAI_API_KEY) throw error(503, 'AI chat is not configured. Add OPENAI_API_KEY to your server environment.');
  if (!body || !Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 16) throw error(400, 'Invalid chat history.');
  const messages = body.messages.map(m => {
    if (!m || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 1500) throw error(400, 'Invalid message. Keep each message under 1,500 characters.');
    return {role:m.role, content:m.content.trim()};
  });
  if (messages.at(-1).role !== 'user') throw error(400, 'Last message must be from the customer.');
  const sku = typeof body.sku === 'string' && Object.hasOwn(PRODUCTS, body.sku) ? body.sku : null;
  const product = sku ? PRODUCTS[sku] : 'No specific product selected';
  const instructions = `You are the friendly, concise shopping assistant for Maren & Co, a fictional demo storefront. The customer is currently viewing: ${product}. Products in this demo include: ${Object.values(PRODUCTS).join(', ')}. Help with product questions, choosing items, and fit. Do not invent product specifications, materials, sizes, measurements, shipping terms, stock, or policies. If exact details are not provided in the customer's question, acknowledge uncertainty and suggest checking the product page. Do not claim to have live inventory or order access. Keep replies brief (2-5 sentences). Do not request personal or payment details.`;
  const response = await fetch('https://api.openai.com/v1/responses', {
    method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
    body:JSON.stringify({model:process.env.OPENAI_MODEL || 'gpt-4.1-mini', instructions, input:messages, max_output_tokens:280}),
    signal:AbortSignal.timeout(20000)
  }).catch(()=>{throw error(502,'Could not reach the AI service. Please try again.');});
  if (!response.ok) { console.error('OpenAI API returned status', response.status); throw error(502,'AI service could not answer right now.'); }
  const data = await response.json();
  const reply = (data.output || []).flatMap(o=>o.content || []).filter(c=>c.type==='output_text').map(c=>c.text).join('\n').trim();
  if (!reply) throw error(502,'AI returned an empty answer. Please try again.');
  return {reply};
}
