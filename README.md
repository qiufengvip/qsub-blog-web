# QSub Blog Web

This project powers the QSub blog frontend. It is built with Vue 3, TypeScript, Vite, and Element Plus. The app now supports server-side rendering (SSR) with an Express server for improved SEO and first paint.

## Getting Started

Install dependencies:

```bash
npm install
```

### Development Server

Run the SSR-aware development server. The Express server proxies Vite's dev middleware and performs server-side rendering on each request.

```bash
npm run dev
```

The application will be available at `http://localhost:4173` (or the port shown in the console output).

### Type-Checking

Type checking is provided through `vue-tsc`. The legacy codebase still contains a number of type issues, so the command currently fails; fix or ignore those issues before relying on the output.

```bash
npm run test
```

### Production Build

Create both the client bundle and the server bundle used by the Express renderer:

```bash
npm run build
```

Client assets will be emitted under `dist/` and the SSR bundle under `dist/entry-server.mjs`.

### Production Preview

After building, launch the Express server in production mode to serve the pre-rendered pages:

```bash
npm run preview
```

## Project Structure Highlights

- `src/entry-client.ts` – Hydration entry point executed in the browser.
- `src/entry-server.ts` – SSR entry that renders the app to a string per request.
- `server.mjs` – Minimal Express server that handles SSR in development and production.
- `src/app.ts` – Factory for creating Vue app instances with fresh router and store per request.

## Additional Notes

The project includes third-party libraries such as Element Plus, axios, and md-editor-v3. Some legacy modules still depend on browser-only APIs, so ensure guards are in place when adding new SSR features.
