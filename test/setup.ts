import { afterAll, afterEach, beforeAll } from 'vitest'
import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { vi } from 'vitest'

config.global.mocks = {
  useRoute: () => ({
    params: {},
    query: {},
  }),
  useRouter: () => ({
    push: () => {},
    replace: () => {},
  }),
  useFetch: () => ({
    data: ref(null),
    pending: ref(false),
    error: ref(null),
    refresh: () => {},
  }),
}

beforeAll(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  vi.resetModules()
}) 