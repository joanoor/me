import { defineConfig, presetUno, presetIcons, presetAttributify, UserConfig } from 'unocss'

export default defineConfig({ 
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
})