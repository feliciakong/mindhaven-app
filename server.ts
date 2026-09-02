import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 8080;

async function setupServer() {
  const distPath = path.join(process.cwd(), 'dist');

  // If the dist folder exists, serve static assets directly
  if (fs.existsSync(distPath)) {
    app.use('/assets', express.static(path.join(distPath, 'assets')));
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
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
}

setupServer();
