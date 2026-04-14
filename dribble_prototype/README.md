# Dribble Smart Home Prototype

This is a Vercel-ready Next.js version of the smart home prototype.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

### Option A: GitHub import
1. Push this folder to your GitHub repo.
2. In Vercel, click **Add New Project**.
3. Import the repo and deploy.

### Option B: CLI
```bash
npm install -g vercel
vercel --prod
```

## Notes
- This version removes the original `@/components/ui/*` dependency so it works as a standalone project.
- Main app entry: `app/page.js`
- Main component: `components/DribbleSmartHomePrototype.jsx`
