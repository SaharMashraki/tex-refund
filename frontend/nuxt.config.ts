import i18nConfig from './i18n.config'
console.log('i18nConfig:', i18nConfig)
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Trigger rebuild

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false // Disabled to prevent build-time errors, use IDE for type checking
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // TailwindCSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true
  },

  // Color mode configuration (dark mode)
  colorMode: {
    classSuffix: '',
    preference: 'dark', // default to dark mode
    fallback: 'dark',
    storageKey: 'nuxt-color-mode'
  },

  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', file: 'en.json', dir: 'ltr' },
      { code: 'he', file: 'he.json', dir: 'rtl' }
    ],
    defaultLocale: 'he',
    langDir: './locales/'
  },


  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**']
  },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1'
    }
  },

  // Nitro configuration for API proxy
  nitro: {
    devProxy: {
      '/api/v1': {
        target: 'http://localhost:3001/api/v1',
        changeOrigin: true
      }
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Tax Refund Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Calculate your tax refund for the past 6 years' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' }
      ]
    }
  },

  // Auto-import components
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ]
})
