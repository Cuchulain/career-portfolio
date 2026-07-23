// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import umami from '@yeskunall/astro-umami';

// https://astro.build/config
export default defineConfig({
  site: 'https://dev.jancejka.cz',
  // base: '/',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    icon(),
    sitemap(),
    umami({
        id: "b2ccf8e5-3071-4013-8f80-202fcba0fee5",
        endpointUrl: "https://analytics.rebma.cz"
    })
  ]
});
