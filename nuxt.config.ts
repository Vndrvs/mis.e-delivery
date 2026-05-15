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
  runtimeConfig: {
		public: {
			strapiUrl: "",
		},
	},
  modules: [
    '@nuxtjs/tailwindcss', 
    '@pinia/nuxt', 
    '@nuxtjs/i18n',
    '@nuxtjs/strapi'
  ],
  i18n: {
    defaultLocale: 'hu',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    
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
      'orders': {
        hu: '/rendelesek',
        en: '/orders'
      },
      'login': {
        hu: '/bejelentkezes',
        en: '/login'
      },
      'profile': {
        hu: '/profil',
        en: '/profile'
      },
      'register': {
        hu: '/regisztracio',
        en: '/register'
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
  strapi: {
    url: 'http://46.101.159.56:1337',
    prefix: '/api',
    version: 'v4',
    cookie: { path: '/' }
  },
  ssr: false
})