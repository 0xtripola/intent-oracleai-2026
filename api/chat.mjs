import { handleChat } from '../chat-handler.mjs';
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({error:'Method not allowed'}); }
  try { const result = await handleChat(req.body); return res.status(200).json(result); }
  catch (error) { return res.status(error.status || 500).json({error:error.publicMessage || 'Chat is temporarily unavailable.'}); }
}
