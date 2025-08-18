// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/test-utils',
  ],
  extends: [
    './app/thread'
  ],
  nitro: {
    moduleSideEffects: ["reflect-metadata"]
  }
})