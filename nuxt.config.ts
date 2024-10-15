export default defineNuxtConfig({
  css: ['~/assets/style/reset.css'],

  app: {
    head: {
      title: 'Haikus for Troglodytes',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        }
      ]
    }
  },
  

  modules: [
    '@vite-pwa/nuxt'
  ],

  pwa: {
    manifest: {
      name: 'Haikus for Troglodytes',
      short_name: 'Haikus',
      description: 'A game for cave dwellers',
      background_color: '#000000',
      theme_color: '#000000',
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "pwa-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "pwa-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ],
    }
  },

  compatibilityDate: '2024-10-13'
})