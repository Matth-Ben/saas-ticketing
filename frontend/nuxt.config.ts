// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode", '@vesp/nuxt-fontawesome'],
  darkMode: 'selector',
  ssr: true,
  component: 'fa',
  suffix: true,
  fontawesome: {
    icons: {
      solid: ['window-maximize', 'bell', 'sun', 'moon', 'caret-up', 'caret-down']
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