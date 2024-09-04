// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode", '@vesp/nuxt-fontawesome', '@nuxt/ui'],
  darkMode: 'selector',
  ssr: true,
  component: 'fa',
  suffix: true,
  experimental: {
    search: true
  },
  ui: {
    global: true
  },
  fontawesome: {
    icons: {
      solid: ['window-maximize', 'bell', 'sun', 'moon', 'caret-up', 'caret-down', 'magnifying-glass']
    }
  },
  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2
    },
    config: {},
    viewer: true,
    content: [
      'components/**/*.{vue,js,ts}',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'composables/**/*.{js,ts}',
      'plugins/**/*.{js,ts}',
      'utils/**/*.{js,ts}',
      'App.{js,ts,vue}',
      'app.{js,ts,vue}',
      'Error.{js,ts,vue}',
      'error.{js,ts,vue}',
      'app.config.{js,ts}'
    ]
  }
})