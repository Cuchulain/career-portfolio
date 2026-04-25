import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import faviconSrc from '../assets/images/favicon1.png';

const icon192 = await getImage({ src: faviconSrc, width: 192, height: 192, format: 'png' });
const icon512 = await getImage({ src: faviconSrc, width: 512, height: 512, format: 'png' });

export const GET: APIRoute = () => {
  const manifest = {
    name: 'Jan Čejka',
    short_name: 'Jan Čejka',
    description: 'Senior Software Architect for Web, Backend & Infrastructure',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: icon192.src,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: icon512.src,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
};
