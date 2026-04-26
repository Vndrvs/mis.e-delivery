export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { 
    enabled: true 
  },
  css: [
    '~/assets/css/main.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss', 
    '@pinia/nuxt', 
    '@nuxtjs/i18n'
  ],
  i18n: {
    defaultLocale: 'hu',
    strategy: 'prefix_except_default',
    
    locales: [
      { 
        code: 'hu', 
        iso: 'hu-HU', 
        file: 'hu.json' 
      },
      { 
        code: 'en', 
        iso: 'en-US', 
        file: 'en.json' 
      }
    ],

    langDir: '../app/localization/locales',

    pages: {
      'index': {
        hu: '/',
        en: '/'
      },
      'menu': {
        hu: '/etlap',
        en: '/menu'
      },
      'cart': {
        hu: '/kosar',
        en: '/cart'
      },
      'admin-products': {
        hu: '/admin/termekek',
        en: '/admin/products'
      },
      'admin-orders': {
        hu: '/admin/rendelesek',
        en: '/admin/orders'
      },
      'admin-analytics': {
        hu: '/admin/analitika',
        en: '/admin/analytics'
      }
    }
  },
  runtimeConfig: {
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337'
    }
  },
  ssr: false
})