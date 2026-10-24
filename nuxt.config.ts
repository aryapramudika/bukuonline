// Situs statis untuk GitHub Pages. Base URL diisi lewat NUXT_APP_BASE_URL (mis. /bukuonline/).
export default defineNuxtConfig({
  extends: ['docus'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://aryapramudika.github.io',
    name: 'Buku Online',
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },
})
