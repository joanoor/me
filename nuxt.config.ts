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
  css: [
    '@unocss/reset/normalize.css',
    '@/assets/styles/main.scss',
    '@/assets/styles/component/index.scss',
  ],
  runtimeConfig: {
    public: {
      gd_private: 'a1d75804c5e1df6a07e15888d31a8ea7', 
      qWeather_private: 'b2c3ca5393b143ec82d69e7496aa289b'
      // tx_private: 'CDDBZ-FBNH2-XCYUZ-CB74S-PK35F-4ABJK',

    }
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
