import { afterAll, afterEach, beforeAll } from 'vitest'
import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// Глобальные настройки для Vue Test Utils
config.global.mocks = {
  // Добавляем моки для Nuxt composables
  useRoute: () => ({
    params: {},
    query: {},
  }),
  useRouter: () => ({
    push: () => {},
    replace: () => {},
  }),
  // Добавляем мок для useFetch
  useFetch: () => ({
    data: ref(null),
    pending: ref(false),
    error: ref(null),
    refresh: () => {},
  }),
}

// Настройка Pinia для тестов
beforeAll(() => {
  setActivePinia(createPinia())
})

// Очистка после каждого теста
afterEach(() => {
  // Очищаем моки и состояние Pinia
})

// Очистка после всех тестов
afterAll(() => {
  // Очищаем все, что нужно после завершения всех тестов
}) 