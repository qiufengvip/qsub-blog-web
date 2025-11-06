import fs from 'fs';
import path from 'path';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const isProd = process.env.NODE_ENV === 'production';
const resolve = (p) => path.resolve(process.cwd(), p);

function serializeState(state) {
  const json = JSON.stringify(state || {});
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/&/g, '\\u0026');
}

async function createServer() {
  const app = express();

  const {
    SSR_API_BASE_URL,
    API_PROXY_TARGET,
    SSR_API_STRIP_PREFIX,
    API_BASE_URL,
    VITE_API_BASE_URL,
  } = process.env;
  const rawApiTarget =
    SSR_API_BASE_URL || API_PROXY_TARGET || API_BASE_URL || VITE_API_BASE_URL || 'http://127.0.0.1:8080/';
  const apiTarget = rawApiTarget.endsWith('/') ? rawApiTarget : `${rawApiTarget}/`;
  const stripPrefix = SSR_API_STRIP_PREFIX !== 'false';

  app.use(
    '/api',
    createProxyMiddleware({
      target: apiTarget,
      changeOrigin: true,
      logLevel: 'warn',
      pathRewrite: stripPrefix ? { '^/api': '' } : undefined,
      onError(err, req, res) {
        console.error('[proxy] request error:', err.message);
        if (!res.headersSent) {
          res.status(502).end('API proxy failed');
        }
      },
    })
  );

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
        const { html: appHtml, preloadLinks, state } = await render(url);
        const html = template
          .replace('<!--preload-links-->', preloadLinks)
          .replace('<!--ssr-outlet-->', appHtml)
          .replace('<!--initial-state-->', `<script>window.__INITIAL_STATE__=${serializeState(state)}</script>`);
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
        const { html: appHtml, preloadLinks, state } = await render(url, manifest);
        const html = template
          .replace('<!--preload-links-->', preloadLinks)
          .replace('<!--ssr-outlet-->', appHtml)
          .replace('<!--initial-state-->', `<script>window.__INITIAL_STATE__=${serializeState(state)}</script>`);
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
