// https://nuxt.com/docs/api/configuration/nuxt-config
import presetUno from "@unocss/preset-uno"
import presetIcons from "@unocss/preset-icons"
import presetAttributify from '@unocss/preset-attributify'

export default defineNuxtConfig({
  alias: {
    '@ivy/core': "/libs/core",
    '@ivy/cache': "/libs/cache",
    '@ivy/chart': "/libs/chart",
    '@ivy/cipher': "/libs/cipher",
    '@ivy/form': "/libs/form",
    '@ivy/request': "/libs/request",
  },

  vite: {

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/assets/styles/modules' as *;`,
        },
      },
    }
  },
  modules: [
    '@unocss/nuxt'
  ],
  unocss: {
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons({
        scale: 1.2,
        warn: true,
      }),
    ]
  },
})
