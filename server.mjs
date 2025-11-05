import fs from 'fs';
import path from 'path';
import express from 'express';

const isProd = process.env.NODE_ENV === 'production';
const resolve = (p) => path.resolve(process.cwd(), p);

async function createServer() {
  const app = express();

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule('/src/entry-server.ts');
        const { html: appHtml, preloadLinks } = await render(url);
        const html = template
          .replace('<!--preload-links-->', preloadLinks)
          .replace('<!--ssr-outlet-->', appHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        next(error);
      }
    });
  } else {
    const compression = (await import('compression')).default;
    const serveStatic = (await import('serve-static')).default;
    const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
    const manifest = JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8'));
    const { render } = await import('./dist/server/entry-server.js');

    app.use(compression());
    app.use(
      serveStatic(resolve('dist/client'), {
        index: false,
      })
    );

    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        const { html: appHtml, preloadLinks } = await render(url, manifest);
        const html = template
          .replace('<!--preload-links-->', preloadLinks)
          .replace('<!--ssr-outlet-->', appHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        res.status(500).end(error.stack);
      }
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`);
  });
}

createServer();
