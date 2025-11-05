import { renderToString } from '@vue/server-renderer';
import type { App } from 'vue';
import { createApp } from './app';

type Manifest = Record<string, string[]>;

function renderPreloadLinks(modules: Set<string>, manifest: Manifest) {
  const seen = new Set<string>();
  let links = '';

  modules.forEach((id) => {
    const files = manifest[id];
    if (!files) {
      return;
    }
    files.forEach((file) => {
      if (seen.has(file)) {
        return;
      }
      seen.add(file);
      if (file.endsWith('.js')) {
        links += `<link rel="modulepreload" crossorigin href="${file}">`;
      } else if (file.endsWith('.css')) {
        links += `<link rel="stylesheet" href="${file}">`;
      }
    });
  });

  return links;
}

export async function render(url: string, manifest?: Manifest) {
  const { app, router } = createApp(true);

  router.push(url);
  await router.isReady();

  const ctx: { modules?: Set<string> } = {};
  const appHtml = await renderToString(app as App, ctx);

  const preloadLinks = manifest && ctx.modules ? renderPreloadLinks(ctx.modules, manifest) : '';

  return {
    html: appHtml,
    preloadLinks,
  };
}
