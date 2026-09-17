# Haven — virtual counselling platform (demo)

React + TypeScript frontend for the Haven pitch demo. Pairs with the FastAPI backend in `../backend`.

## Local development

```bash
npm install
npm run dev
```

By default the app talks to a backend running at `http://127.0.0.1:8018`. To point it at a
deployed backend instead, set `VITE_API_BASE` (see `.env.example`).

## Deployment (Netlify / Vercel)

This is a static build — `npm run build` outputs to `dist/`. `netlify.toml` and `vercel.json`
are already set up with SPA redirects so client-side routes (`/client`, `/session/:id`, etc.)
don't 404 on refresh.

1. Deploy the backend first (see `../backend`) and note its URL.
2. Deploy this folder to Netlify or Vercel, setting the env var `VITE_API_BASE` to that backend URL.
3. Back on the backend host, set `FRONTEND_ORIGINS` to this site's final URL so CORS allows it.
