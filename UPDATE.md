# Aktualizace CV webu

## Verze a kompatibilita

Verze byly ověřeny ve veřejném npm registru dne **2026-10-14** pomocí endpointů
`https://registry.npmjs.org/<package>/latest` a síťového `pnpm outdated`.
`package.json` i skutečné vyřešené verze v `pnpm-lock.yaml` jsou aktualizované.

| Balíček                            | Před aktualizací (lockfile) | Po aktualizaci |
| ---------------------------------- | --------------------------- | -------------- |
| `astro`                            | 6.1.9                       | **7.3.8**      |
| `@astrojs/check`                   | 0.9.8                       | 0.9.10         |
| `@astrojs/sitemap`                 | 3.7.3                       | 3.7.4          |
| `astro-icon`                       | 1.1.5                       | 1.2.0          |
| `tailwindcss`, `@tailwindcss/vite` | 4.2.4                       | **4.3.3**      |
| `sharp`                            | 0.34.5                      | 0.35.5         |
| `typescript`                       | 5.9.3                       | **6.0.3**      |

Oba fonty jsou na `5.3.0`. Iconify sady: `arcticons 1.2.58`, `cbi 1.2.64`,
`devicon-plain 1.2.62`, `mdi 1.2.3`, `simple-icons 1.2.100`, `skill-icons 1.2.4`
a `vscode-icons 1.2.89`.

- **TypeScript je vědomá výjimka:** npm latest je `7.0.2`, ale
  `@astrojs/check@0.9.10` deklaruje peer `^5.0.0 || ^6.0.0`. Proto se používá
  nejnovější vyřešená kompatibilní verze `6.0.3`; typová kontrola zůstává zapnutá.
- Astro 7 i `astro-icon@1.2.0` vyžadují Node **≥ 22.12.0**. Stávající
  `engines.node` a Node 22 v GitHub Pages workflow jsou kompatibilní.
  Tailwind Vite plugin podporuje Vite 8 používané Astrem 7.
- `@yeskunall/astro-umami@0.0.9` je stále npm latest, ale jeho peer podporuje
  pouze Astro 3–6. Balíček je nahrazen přímým produkčním skriptem v
  `Layout.astro`, se stejným endpointem a `data-website-id`. Hodnoty jsou
  centrálně v `SITE_CONFIG.umami` v `src/config.ts`; nezávislá regresní očekávání
  ve smoke testu brání náhodné změně původního měření. Umami **není vypnuté**;
  Cloudflare Web Analytics zůstává zachováno.
- pnpm 12 při explicitní aktualizaci právě vydané datové sady `vscode-icons`
  vytvořilo úzce omezenou `minimumReleaseAgeExclude` pro
  `@iconify-json/vscode-icons@1.2.89`. Výjimka nepovoluje jiné verze ani balíčky;
  nemění povolené lifecycle buildy `esbuild` a `sharp`. Při další aktualizaci
  ji lze odstranit, jakmile verze splní výchozí 24hodinovou čekací lhůtu.

## Posouzení upstreamu

Zdroj: `https://github.com/nbakh16/career-portfolio-template`, nově stažený
master **`1367d019ce8399f528fbc49388c47d796c395410`** (šablona `0.2.0`).
Obsahuje 29 commitů, které nejsou v lokálním HEAD. Objekty byly staženy,
ale fetch nedokončil aktualizaci remote tracking referencí kvůli:

```text
error: cannot update the ref 'refs/remotes/upstream/master': unable to append to '.git/logs/refs/remotes/upstream/master': Operation not permitted
```

Totéž nastalo pro `upstream/dev`; `upstream/master` tak stále ukazuje na
`8a1e236082860303859ca3c2192e41c5e316c4e6`. Porovnání bylo provedeno přímo
čtením stažených Git objektů, protože lokální Git příkazy v sandboxu selhávají
na přístupu k `/dev/null`. Nebyl proveden merge, změna lokální větve ani commit.

| Změny upstreamu                                                                                       | Rozhodnutí pro tento fork                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cb183c3d`, `30ca22cd` – konfigurace tématu                                                           | Převzato `SITE_CONFIG`; zachováno lokální výchozí `default` a typově omezené čtyři základní názvy.                                                                                                                |
| `0a9d90e4`, `2f359d32`, `87c88e03` – optimalizace obrázků                                             | Eager hero obrázek převzat. Optimalizace projektových obrázků již má lokální ekvivalent; konkrétní srovnání níže.                                                                                                 |
| `90535071` – paměťové úniky                                                                           | Převzato rušení starých intervalů při reinitializaci slideru a odstranění trvalého `will-change` profilové animace.                                                                                               |
| `b715f3c3` – reveal animace                                                                           | Převzaty indexové mapy v career/projects/tech/contact bez změny lokálních textů a časování.                                                                                                                       |
| `955c218b` – matrix rain a scroll-to-top                                                              | Převzato pozastavení matrix rain na skryté kartě. Samotné rozdělení skriptů do utilit není nutné; místní scroll-to-top a mobilní statický režim zůstávají.                                                        |
| `b96fc6f8` – iOS a přístupnost                                                                        | Převzato odstranění fixed background attachment a CSS pro reduced-motion; všech osm schémat a lokální přechody zachovány.                                                                                         |
| `2ed02849` – systémové téma                                                                           | Nepřebírá se nový výchozí light/system režim ani změna persistence; fork zachovává výchozí dark a uloženou volbu uživatele.                                                                                       |
| `c78720e8`, `46788f5b`, `4699c34d`, `77f53519` – SEO                                                  | Převzaty robots.txt, JSON-LD WebSite/Person a rozměry/alt OG image, adaptované na místní JSON a `Astro.site`. Zachováno `lang="cs"`, `cs_CZ`, canonical a vlastní favicony/OG.                                    |
| `305fad18` – llms.txt                                                                                 | Nepřebírá se samostatné zveřejnění celého CV a všech kontaktů. Lokální data obsahují i odkazy skryté přes `showInHero`/`showInContact`; JSON-LD obsahuje pouze zobrazené veřejné profily.                         |
| `e4eb1b53`, `b8c2263b`, `9694f5a2`, `9348cc46`, `105ed93c`, `90da888e`, `4ec927bc` – obsah a redesign | Nepřepisují se český obsah, více variant CV, vzhled karet, deset řádků popisu, kariérní přehled, footer ani hash `#tech` novým `#skills`. Nová pole dat/upstream placeholdery nejsou pro převzaté opravy potřeba. |
| `f26f35bb` – kontakt                                                                                  | Oprava animace nového `contact-preferred` bloku není použitelná: tento blok ve forku není; místní header/cards/footer už mají reveal.                                                                             |
| `5aa9b4d2` – závislosti šablony                                                                       | Použity novější kompatibilní verze z npm a místní pnpm lockfile, nikoli upstream npm lockfile nebo nová sada `devicon` používaná jen redesignem footeru.                                                          |
| `c992f8eb`, merge commity `82d0e7a8`, `8a1e2360`, `d776f6ab`, `1367d019`                              | Dokumentace a sloučení výše uvedených změn; lokální konfigurace, data a deploy se nepřepisují.                                                                                                                    |

### Konkrétní porovnání projektových obrázků

Upstream `87c88e03`/aktuální `project-card.astro` volá `resolveAssetImage` z
`src/utils/images.ts`, načítá soubory přes lazy glob `/src/assets/*` a předává
metadata komponentě `Image`. Nevyřešené obrázky odfiltruje; prázdný seznam
nahrazuje `/placeholder.jpeg`.

Ve forku `projects.astro` již používá eager glob
`../assets/images/projects/*.{png,jpg,jpeg,webp}` a předává `ImageMetadata`
v `resolvedImages` do `project-card.astro`. Ten předává metadata do stejné
Astro komponenty `Image`, takže build již generuje optimalizované obrázky.
Převzetí upstream cesty `/src/assets/*` by místní obrázky nenašlo; filtrování
nevyřešených názvů by navíc odstranilo stávající public/API fallback.
Proto zůstává místní resolver i `getImage` placeholder a přebírá se fallback
pro úplně prázdný seznam obrázků. Upstream slider dots a redesign kategorií
jsou vizuální změny, nikoli nutná součást optimalizace; nejsou přebírány.

## Ověření

Síťové aktualizace a instalace proběhly přes povolené nástroje s pnpm `12.11.2`,
bez lifecycle skriptů a pnpm hooks. Instalace skončila s exit `0`, lockfile
prošel supply-chain kontrolami a nebylo nutné ručně spouštět postinstall.
Node při lokálních kontrolách: `22.23.2`.

```bash
pnpm astro check
pnpm run build
pnpm run test:smoke
pnpm run preview
```

V sandboxu spouštění shellových skriptů přes pnpm selhává na
`ERR_PNPM_EXECUTOR_RUN_SCRIPT_SPAWN`. Kontroly proto běží přímo nad stejnými
nainstalovanými CLI, bez vypnutí kontrol:

```bash
node node_modules/astro/bin/astro.mjs check
node node_modules/astro/bin/astro.mjs build
node --test scripts/verify-build.mjs
```

- Typová kontrola: 18 souborů, `0 errors`, `0 warnings`, čtyři původní
  doporučení na nepoužité symboly. Astro 7 odhalilo neplatný HTML komentář uvnitř map výrazu
  v `contact.astro`; komentář byl odstraněn a komponenta nyní projde.
- Produkční build: úspěšný, včetně `robots.txt`, manifestu, sitemap a všech
  13 obrázků nově zpracovaných po odstranění image cache. `astro-icon` upozorňuje
  na neexistující volitelný adresář `src/icons`; instalované Iconify sady se
  renderují správně.
- Smoke testy: osm testů kontroluje navigaci, CV, obrázky/favikony/OG, Umami
  i Cloudflare, shodu Umami s centrální konfigurací, lokální SEO a nezveřejňování
  skrytých profilů, osm schémat témat, rušení intervalů slideru a pause/resume
  matrix rain, prioritu CSS témat a kontrast světlých palet.
- Lokální JSON, public/CV soubory, services, nesouvisející dokument a GitHub
  Pages workflow byly porovnány s předchozím stavem a zůstaly nezměněny.
- Konzistence importerů lockfile byla ověřena také offline příkazem pnpm 10
  `install --offline --frozen-lockfile --lockfile-only` (exit `0`).
  Úplné offline ověření pnpm 12 s frozen lockfile a vypnutými lifecycle skripty
  však selhalo na `ERR_PNPM_NO_OFFLINE_META` pro `@astrojs/check` v jeho výchozí
  metadata cache. Síťová instalace byla úspěšná; režim lockfile-only není
  vydáván za plnou frozen instalaci.
- Závěrečné síťové `pnpm outdated`: jediná položka je TypeScript (`current`
  a `wanted` 6.0.3, `latest` 7.0.2), z výše popsaného důvodu kompatibility.
- Prettier kontrola `package.json`, `src/config.ts`, smoke testu, robots route
  a tohoto dokumentu: úspěšná.

## Zbývající kontroly

Při závěrečné kontrole dne 14. 10. 2026 prošla síťová instalace
`pnpm install --frozen-lockfile --ignore-scripts` s pnpm 12.11.2 včetně
supply-chain kontroly. Typová kontrola, produkční build a všech osm smoke
testů prošly. Vlastník schválil přípravu změn do samostatné větve a PR.
Aktuální HEAD má shodný obsah s `origin/master`; starší úpravy profesního
zaměření už byly sloučeny v PR #4. Samostatný návrhový dokument není součástí
upgrade.

- Provést vizuální preview:
  hash navigace a smooth scroll, mobilní menu, přepínání témat bez FOUC,
  výběr CV a obrázkové slidery. Spuštění Astro 7 preview v sandboxu skončilo
  na `Preview server process exited before becoming ready.`; při předchozím
  preview prostředí odmítlo listen na localhost s
  `listen EPERM: operation not permitted 127.0.0.1:4321`. Vizuální ověření
  v prohlížeči proto není doloženo. Ani offline pokus o spuštění nainstalovaného
  Chrome přes Puppeteer s CDP pipe (bez HTTP serveru) neuspěl: `spawn EPERM`.
  Před nasazením zkontrolovat také gradient na desktopu a mobilu: odstranění
  `background-attachment: fixed` mění jeho vykreslení přes výšku dokumentu.
- Po začlenění změn ověřit GitHub Actions a `https://dev.jancejka.cz`.
- Dokončit fetch v běžném prostředí a při budoucím merge použít právě posouzený
  hash; selektivně převzaté změny zůstávají v Git historii nezačleněné.
- Při další aktualizaci ověřit podporu TypeScript 7 v `@astrojs/check`; analytiku
  ani typovou kontrolu nevypínat kvůli úspěšnému buildu.
