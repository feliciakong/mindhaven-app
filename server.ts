import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 8080;

async function setupServer() {
  const distPath = path.join(process.cwd(), 'dist');

  if (fs.existsSync(distPath)) {
    // Serve static assets; return 404 if a specific asset file is missing
    app.use('/assets', express.static(path.join(distPath, 'assets')), (req, res) => {
      res.status(404).send('Asset not found');
    });

    app.use(express.static(distPath));

    // Fallback only for HTML SPA routes
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
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
