# CareerPortfolio: Data-Driven Astro SSG
Live Demo: [careerportofio.netlify.app](https://careerportofio.netlify.app)

[![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/🤝_Contributions-Welcome-blue)](CONTRIBUTING.md)

A high-performance, responsive portfolio built with **Astro**, **Tailwind CSS**, and **Native Browser Animations**. Designed to be 100% data-driven and easy to customize as a reusable template.

## 🌟 Highlights
- **Zero-JS by Default:** Leveraging Astro's islands architecture.
- **JSON-First:** Update your information in `src/data/` without touching any code.
- **Fully Responsive:** Optimized for mobile, tablet, and desktop.
- **Performance:** Optimized for perfect Lighthouse scores.

## 🛠️ Tech Stack
- **Frontend:** [Astro](https://astro.build/) (Static Site Generation)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Iconify](https://iconify.design/) via `astro-icon`
- **Deployment:** [GitHub Pages](https://pages.github.com/) (`https://dev.jancejka.cz`)
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) *(Works without backend — open source release coming soon)*

## 🚀 Getting Started
Follow these instructions to get a local copy up and running.

### Prerequisites
Make sure you have **Node.js** (v22.12.0 or higher) and **pnpm** installed. **Astro v7** is installed with the project dependencies.

### Installation
1. Click **Use this template** on this repository.
2. Choose **Create a new repository**.
3. Clone your new repository: `git clone <your-repo-url>`
4. Navigate to your repo: `cd <your-repo-name>`
5. Install dependencies: `pnpm install --frozen-lockfile`
6. Start development server: `pnpm run dev`
7. Update your content in `/src/data/`
8. Build and deploy on your preferred platform


## 🛠️ How to Customize
To make this portfolio yours, simply edit the JSON files in `src/data/`.
```
Directory Structure
├── public/              # Static assets (placeholder.jpg, favicon)
├── src/
│   ├── components/      # Reusable Astro components
│   ├── data/            # JSON files for project data
│   ├── layouts/         # Layout templates with Meta tags
│   ├── pages/           # Site routes (index.astro)
│   └── styles/          # global css styles
├── astro.config.mjs     # Astro configuration
└── tsconfig.json        # Typescript configuration
```

#### Useful commands and links for reference:

| Command                         | Action                                          |
| :------------------------------ | :---------------------------------------------- |
| `pnpm install --frozen-lockfile` | Installs dependencies                           |
| `pnpm run dev`                  | Starts local dev server at `localhost:4321`      |
| `pnpm run build`                | Build your production site to `./dist/`          |
| `pnpm run preview`              | Preview your build locally, before deploying    |
| `pnpm astro ...`                | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro --help`             | Get help using the Astro CLI                    |

Tailwind CSS: `pnpm astro add tailwind`

Inter font: `pnpm add @fontsource-variable/inter`

Host Grotesk font: `pnpm add @fontsource-variable/host-grotesk`

Astro-icon: `pnpm astro add astro-icon`

Material Desing Icons: `pnpm add @iconify-json/mdi`

https://docs.astro.build/en/guides/styling/#add-tailwind-4

https://www.astroicon.dev

https://icon-sets.iconify.design/mdi/?category=Material

## Aktualizace tohoto forku

Web používá Astro **7.3.8**, Tailwind **4.3.3** a aktualizované integrace,
fonty a ikony. TypeScript zůstává na kompatibilní verzi **6.0.3**.
[Stav aktualizace](UPDATE.md) popisuje ověřené verze, převzaté změny upstreamu
a zbývající kontroly. Po buildu spusťte `pnpm run test:smoke`.

## 🤝 Contributing
Contributions are welcome!  
Please read the [Contributing Guide](CONTRIBUTING.md) before opening a PR.

## 📝 License
This project is licensed under the [MIT License](LICENSE)
