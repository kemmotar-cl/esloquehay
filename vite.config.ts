import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'EsLoQueHay',
        short_name: 'EsLoQueHay',
        description: 'Vendemos experiencias, no recetas',
        theme_color: '#de5a0e',
        background_color: '#f9fafb',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        categories: ['food', 'lifestyle'],
        lang: 'es',
        dir: 'ltr',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/(api|worker)\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.cloudflare\.com\/cdn-cgi\/trace/,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/ipapi\.co\/json\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
});
