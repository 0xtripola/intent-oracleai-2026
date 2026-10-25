import http from 'node:http';
import { existsSync } from 'node:fs';
import { handleChat } from './chat-handler.mjs';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = process.cwd();
const types = { '.html': 'text/html', '.css': 'text/css', '.mjs': 'text/javascript', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/chat') {
      if (req.method !== 'POST') { res.writeHead(405); res.end('Method not allowed'); return; }
      let raw='';
      for await (const chunk of req) { raw += chunk; if(raw.length > 30000) { res.writeHead(413); res.end('Request too large'); return; } }
      try { const result=await handleChat(JSON.parse(raw)); res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify(result)); }
      catch (e) { res.writeHead(e.status || 500, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:e.publicMessage || 'Chat unavailable'})); }
      return;
    }
    const file = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(root + sep) || !['.html', '.css', '.mjs', '.js', '.svg'].includes(extname(file))) { res.writeHead(404); res.end('Not found'); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] + '; charset=utf-8', 'Cache-Control': 'no-cache' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(Number(process.env.PORT) || 3000, '127.0.0.1', () => console.log('Intent is ready at http://localhost:' + server.address().port));
