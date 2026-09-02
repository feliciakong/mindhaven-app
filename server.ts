import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 8080;

const distPath = path.join(process.cwd(), 'dist');

if (fs.existsSync(distPath)) {
  // Serve static assets without auto-serving index.html at root
  app.use(express.static(distPath, {
    index: false,
    maxAge: '1d'
  }));

  // Fallback route: Force browser NEVER to cache index.html
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Development mode fallback
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`MindHaven server running on port ${PORT}`);
});
