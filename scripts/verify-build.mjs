import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import sharp from 'sharp';
import ts from 'typescript';

const read = (file) => readFileSync(file, 'utf8');
const html = read('dist/index.html');
const home = JSON.parse(read('src/data/home.json'));

function componentScript(file) {
  const source = read(file).match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert(source, `Missing component script: ${file}`);
  return ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

function timers() {
  let nextId = 0;
  const active = new Map();
  return {
    active,
    setInterval: (callback) => {
      const id = ++nextId;
      active.set(id, callback);
      return id;
    },
    clearInterval: (id) => active.delete(id),
  };
}

function classList(initial = []) {
  const classes = new Set(initial);
  return {
    add: (...values) => values.forEach((value) => classes.add(value)),
    remove: (...values) => values.forEach((value) => classes.delete(value)),
    contains: (value) => classes.has(value),
  };
}

test('production output preserves navigation, CV, optimized images and analytics', async () => {
  for (const id of ['home', 'career', 'projects', 'tech', 'contact']) {
    assert(html.includes(`id="${id}"`), `Missing section ${id}`);
    assert(html.includes(`href="#${id}"`), `Missing navigation ${id}`);
  }
  assert(/<img\b[^>]*alt="Jan Čejka"[^>]*loading="eager"/.test(html));
  assert(html.includes('<svg'));
  for (const image of html.matchAll(/<img\b[^>]*src="([^"?#]+)"/g)) {
    if (image[1].startsWith('/'))
      assert(existsSync(`dist${image[1]}`), image[1]);
  }
  for (const resume of home.resumes) {
    assert(html.includes(resume.url));
    assert(existsSync(`dist${resume.url}`));
  }
  assert.equal(
    html.split('https://analytics.rebma.cz/script.js').length - 1,
    1,
  );
  assert(
    html.includes('data-website-id="b2ccf8e5-3071-4013-8f80-202fcba0fee5"'),
  );
  assert(html.includes('https://static.cloudflareinsights.com/beacon.min.js'));
  assert(read('src/layouts/Layout.astro').includes('import.meta.env.PROD &&'));

  const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert(og);
  const ogMetadata = await sharp(`dist${new URL(og).pathname}`).metadata();
  assert.equal(ogMetadata.width, 1200);
  assert.equal(ogMetadata.height, 630);
  for (const size of [32, 180, 192, 512]) {
    const metadata = await sharp(`dist/favicon-${size}.png`).metadata();
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
  }
  const manifest = JSON.parse(read('dist/site.webmanifest'));
  for (const icon of manifest.icons) assert(existsSync(`dist${icon.src}`));
});

test('Umami markup uses the central configuration', () => {
  const compiledConfig = ts.transpileModule(read('src/config.ts'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiledConfig, { exports });
  const { umami } = exports.SITE_CONFIG;

  assert.equal(new URL(umami.scriptUrl).protocol, 'https:');
  assert(umami.websiteId);
  const script = html
    .match(/<script\b[^>]*>/g)
    ?.find((tag) => tag.includes(`src="${umami.scriptUrl}"`));
  assert(script);
  assert(script.includes(`data-website-id="${umami.websiteId}"`));
  assert(/\bdefer(?:\s|=|>)/.test(script));
});

test('SEO uses the local profile without publishing hidden social links', () => {
  const json = html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  )?.[1];
  assert(json);
  const data = JSON.parse(json);
  const person = data['@graph'].find((item) => item['@type'] === 'Person');
  assert.equal(person.name, home.name);
  assert.equal(person.description, home.description);
  assert.deepEqual(
    person.sameAs,
    home.socials
      .filter((social) => social.showInHero && /^https?:\/\//.test(social.url))
      .map((social) => social.url),
  );
  assert(
    read('dist/robots.txt').includes(
      'Sitemap: https://dev.jancejka.cz/sitemap-index.xml',
    ),
  );
  assert(existsSync('dist/sitemap-index.xml'));
  assert(html.includes('lang="cs"'));
  assert(html.includes('content="cs_CZ"'));
});

test('theme initialization preserves saved dark/light modes for all four bases', () => {
  const layout = read('src/layouts/Layout.astro');
  const script = layout.match(
    /<script is:inline define:vars=\{\{ baseTheme, defaultTheme \}\}>([\s\S]*?)<\/script>/,
  )?.[1];
  assert(script);
  const css = read('src/styles/global.css');
  for (const baseTheme of ['default', 'strategic', 'innovator', 'executive']) {
    for (const saved of [
      null,
      'other-dark',
      `${baseTheme}-dark`,
      `${baseTheme}-light`,
    ]) {
      let stored = saved;
      let applied;
      vm.runInNewContext(script, {
        baseTheme,
        defaultTheme: `${baseTheme}-dark`,
        localStorage: {
          getItem: () => stored,
          setItem: (_, value) => {
            stored = value;
          },
        },
        document: {
          documentElement: {
            setAttribute: (_, value) => {
              applied = value;
            },
          },
        },
      });
      const expected = saved?.startsWith(baseTheme)
        ? saved
        : `${baseTheme}-dark`;
      assert.equal(applied, expected);
      assert.equal(stored, expected);
      assert(css.includes(expected));
    }
  }
  assert(css.includes('@media (prefers-reduced-motion: reduce)'));
});

test('production theme overrides remain unlayered and text utilities use runtime colors', () => {
  const stylesheet = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/)?.[1];
  assert(stylesheet);
  const css = read(`dist${stylesheet}`);
  for (const base of ['default', 'strategic', 'innovator', 'executive']) {
    for (const mode of ['dark', 'light']) {
      const rule = new RegExp(
        `\\[data-theme=(?:"${base}-${mode}"|${base}-${mode})\\]\\s*\\{`,
      ).exec(css);
      assert(rule, `Missing production palette: ${base}-${mode}`);
      // The theme must beat layered Tailwind defaults regardless of layer order.
      const prefix = css.slice(0, rule.index).replace(/\/\*[\s\S]*?\*\//g, '');
      assert.equal(
        (prefix.match(/\{/g)?.length ?? 0) - (prefix.match(/\}/g)?.length ?? 0),
        0,
        `${base}-${mode} must not be inside a cascade layer`,
      );
    }
  }
  for (const color of ['maintext', 'subtext', 'accent']) {
    assert(css.includes(`.text-${color}{color:var(--color-${color})}`));
  }
  assert(/color-scheme:\s*light/.test(css));
  assert(/color-scheme:\s*dark/.test(css));
  const hero = html.match(/<section\b[^>]*id="home"[\s\S]*?<\/section>/)?.[0];
  assert(hero);
  assert(!hero.includes('text-gray'));
  assert(hero.includes('text-subtext'));
});

test('light theme text and accents meet WCAG AA contrast across the background gradient', () => {
  const css = read('src/styles/global.css');
  const lightBackground = css.match(/\[data-theme\$="-light"\] body\s*\{([^}]+)\}/)?.[1];
  assert(lightBackground);
  assert(!lightBackground.includes('black'));
  assert(lightBackground.includes('var(--color-background) 0%'));
  assert(lightBackground.includes('white 60%'));

  const luminance = (rgb) => rgb
    .map((channel) => channel / 255)
    .map((channel) => channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);

  for (const base of ['default', 'strategic', 'innovator', 'executive']) {
    const theme = `${base}-light`;
    const palette = css.match(new RegExp(`\\[data-theme="${theme}"\\]\\s*\\{([^}]+)\\}`))?.[1];
    assert(palette, `Missing palette: ${theme}`);
    const colors = Object.fromEntries([...palette.matchAll(/--color-([a-z]+):\s*#([0-9a-f]{6})/gi)]
      .map(([, name, hex]) => [name, hex.match(/../g).map((channel) => parseInt(channel, 16))]));
    const backgrounds = [
      colors.background,
      colors.background.map((channel) => channel * 0.4 + 255 * 0.6),
    ];
    for (const name of ['maintext', 'subtext', 'accent']) {
      for (const background of backgrounds) {
        const foreground = luminance(colors[name]);
        const surface = luminance(background);
        const contrast = (Math.max(foreground, surface) + 0.05) / (Math.min(foreground, surface) + 0.05);
        assert(contrast >= 4.5, `${theme} ${name}: ${contrast.toFixed(2)}:1 is below 4.5:1`);
      }
    }
  }
});

test('reinitializing project sliders clears their previous intervals', () => {
  const clock = timers();
  const events = new Map();
  const images = [
    { classList: classList(['opacity-100', 'z-0']) },
    { classList: classList(['opacity-0', 'z-[-1]']) },
  ];
  const slider = { querySelectorAll: () => images };
  vm.runInNewContext(componentScript('src/components/project-card.astro'), {
    ...clock,
    document: {
      querySelectorAll: () => [slider],
      addEventListener: (event, callback) => events.set(event, callback),
    },
  });
  assert.equal(clock.active.size, 1);
  events.get('astro:after-swap')();
  events.get('astro:after-swap')();
  assert.equal(clock.active.size, 1);
  [...clock.active.values()][0]();
  assert(images[1].classList.contains('opacity-100'));
  assert(images[0].classList.contains('opacity-0'));
});

test('matrix rain pauses in hidden tabs and remains static on mobile', () => {
  for (const [width, initiallyHidden] of [
    [1200, false],
    [1200, true],
    [375, false],
  ]) {
    const clock = timers();
    const events = new Map();
    const letters = [];
    const document = {
      hidden: initiallyHidden,
      getElementById: (id) =>
        id === 'matrix-container'
          ? { appendChild: (letter) => letters.push(letter) }
          : null,
      createElement: () => ({ style: {}, remove() {} }),
      addEventListener: (event, callback) => events.set(event, callback),
    };
    vm.runInNewContext(componentScript('src/layouts/Layout.astro'), {
      ...clock,
      document,
      setTimeout: () => 0,
      window: { innerWidth: width, addEventListener() {} },
    });
    if (width > 768) {
      assert.equal(clock.active.size, initiallyHidden ? 0 : 1);
      document.hidden = true;
      events.get('visibilitychange')();
      assert.equal(clock.active.size, 0);
      document.hidden = false;
      events.get('visibilitychange')();
      events.get('visibilitychange')();
      assert.equal(clock.active.size, 1);
    } else {
      assert.equal(clock.active.size, 0);
      assert.equal(letters.length, 20);
    }
  }
});
