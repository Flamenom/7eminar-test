// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt',
  ],

  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ],

  app: {
    head: {
      title: 'Новостное приложение',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Новостное приложение на Nuxt 3' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBase: '/data'
    }
  },

  compatibilityDate: '2025-04-17'
})