# dbt Fusion Engine — Interactive Guide

An interactive guide to the dbt Fusion Engine covering three key areas:

- **Developer Experience** — VS Code extension, dbt Studio IDE, static analysis, and feature overview
- **Cost Optimization** — State-Aware Orchestration (SAO) simulator, savings breakdown, and rich metadata explorer
- **AI Infrastructure** — Architecture diagram, AI agent demo, native dbt Agents, and MCP/API details

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173/dbt-fusion-guide/](http://localhost:5173/dbt-fusion-guide/) in your browser.

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** and select **GitHub Actions**
3. The workflow at `.github/workflows/deploy.yml` will build and deploy on every push to `main`
4. Your site will be live at `https://<your-username>.github.io/dbt-fusion-guide/`

> **Note:** If your repo name is different from `dbt-fusion-guide`, update the `base` property in `vite.config.js` to match.

## Tech Stack

- React 19
- Vite 6
- Vanilla CSS (no Tailwind dependency — everything is self-contained)
