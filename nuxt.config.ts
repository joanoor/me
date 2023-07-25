// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
  ],
  css: [
    '@unocss/reset/normalize.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/styles/main.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use \'~/styles/modules\' as *;',
        },
      },
    },
  },
})
