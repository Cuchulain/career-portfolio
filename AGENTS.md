# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev         # Start dev server at localhost:4321
pnpm astro check     # Type-check Astro components
pnpm run build       # Build static site to ./dist/
pnpm run test:smoke  # Verify production output and selected client scripts after build
pnpm run preview     # Preview production build locally
```

Smoke tests in `scripts/verify-build.mjs` require a completed production build. They verify assets, analytics, SEO, theme persistence and selected client-script behavior; they do not replace a visual browser test.

## Architecture

Single-page Astro SSG portfolio with hash-based navigation (`#home`, `#career`, `#projects`, `#tech`, `#contact`). Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `master`. Production URL: `https://dev.jancejka.cz`. Node.js ≥ 22.12.0 is required for Astro 7. TypeScript stays on the latest compatible 6.x release because `@astrojs/check` does not support 7.x yet. Umami is loaded directly in `Layout.astro` for production builds, using `SITE_CONFIG.umami` from `/src/config.ts`; Cloudflare Web Analytics remains enabled.

### Content is data-driven

All editable content lives in **`/src/data/*.json`** — not in components. To update the portfolio content, edit these files:

- `home.json` — profile name, bio (HTML allowed), CV URL, social links
- `career.json` — career timeline entries (company, role, period, type, description, skills)
- `projects.json` — project cards (title, description, images, tech, link)
- `tech.json` — skill categories with skill names, levels (1–3), and icon names

Components read this JSON at build time. There is also an **optional API fallback**: in production, if `PUBLIC_API_BASE_URL` is set in the environment, components fetch live data from that endpoint (must return the same JSON shape). Falls back to local JSON on error or in dev mode.

### Theme system

`/src/styles/global.css` defines **4 base themes × 2 modes (dark/light) = 8 color schemes**. The default base theme is configured via `SITE_CONFIG.baseTheme` in `/src/config.ts`. Themes are applied via `data-theme` on `<html>`, stored in localStorage, and set via an inline script in `Layout.astro` before the page renders (no FOUC). CSS variables used: `--color-background`, `--color-accent`, `--color-maintext`, `--color-subtext`, `--color-textrain`.

### Icons

Icons use **astro-icon** with Iconify. Multiple icon sets are installed: `mdi`, `skill-icons`, `simple-icons`, `devicon-plain`, `cbi`, `arcticons`, `vscode-icons`. Reference icons in components as `<Icon name="mdi:github" />`.

### Images

Project images live in `/src/assets/images/projects/` and are loaded via `import.meta.glob`. The layout generates favicons in multiple sizes and an OG image (1200×630px) using **Sharp** at build time.

### Key layout patterns

- `Layout.astro` — root wrapper; handles meta/OG tags, theme injection, matrix rain animation (desktop only), scroll-to-top button with SVG progress circle
- Scroll-triggered reveal animations use **IntersectionObserver** with staggered delays per grid column count
- Mobile nav appears at the bottom and hides on scroll; desktop nav is fixed top
- Smooth scrolling is custom (`easeOutQuad`) rather than CSS `scroll-behavior`

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` (not the PostCSS plugin). Custom animations (`fall`, `double-bounce-pause`, `floating-balloon`, `launch`) are defined in `global.css` under `@theme`.
