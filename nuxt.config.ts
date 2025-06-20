// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  dir: {
    app: 'app'
  },
  modules: [
    '@nuxt/test-utils/module',
  ],
  extends: [
    './app/thread'
  ]
})