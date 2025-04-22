import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import NewsList from '~/components/NewsList.vue'
import NewsCard from '~/components/NewsCard.vue'
import AppLoader from '~/components/AppLoader.vue'
import AppError from '~/components/AppError.vue'
import { useNewsListStore } from '~/stores/news'

// Мокаем store
vi.mock('~/stores/news', () => ({
  useNewsListStore: vi.fn(() => ({
    news: [],
    loading: false,
    error: null,
    fetchNews: vi.fn()
  }))
}))

// Мокаем composables
vi.mock('#imports', () => ({
  useAsyncData: vi.fn(() => ({
    data: ref([]),
    pending: ref(false),
    error: ref(null),
    refresh: vi.fn()
  }))
}))

describe('NewsList', () => {
  let wrapper: any
  const mockNews = [
    {
      id: 1,
      title: 'Test News 1',
      description: 'Test Description 1',
      image: 'test1.jpg',
      content: 'Test Content 1',
      date: '2024-01-01'
    },
    {
      id: 2,
      title: 'Test News 2',
      description: 'Test Description 2',
      image: 'test2.jpg',
      content: 'Test Content 2',
      date: '2024-01-02'
    }
  ]

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    vi.clearAllMocks()
  })

  it('отображает загрузчик во время загрузки', () => {
    const store = useNewsListStore()
    store.loading = true

    wrapper = mount(NewsList, {
      global: {
        components: {
          NewsCard,
          AppLoader,
          AppError
        }
      }
    })

    expect(wrapper.findComponent(AppLoader).exists()).toBe(true)
  })

  it('отображает ошибку при наличии ошибки', () => {
    const store = useNewsListStore()
    store.error = 'Test error message'

    wrapper = mount(NewsList, {
      global: {
        components: {
          NewsCard,
          AppLoader,
          AppError
        }
      }
    })

    expect(wrapper.findComponent(AppError).exists()).toBe(true)
    expect(wrapper.findComponent(AppError).props('message')).toBe('Test error message')
  })

  it('отображает список новостей', async () => {
    const store = useNewsListStore()
    store.news = mockNews
    store.loading = false

    wrapper = mount(NewsList, {
      global: {
        components: {
          NewsCard,
          AppLoader,
          AppError
        }
      }
    })

    const newsCards = wrapper.findAllComponents(NewsCard)
    expect(newsCards).toHaveLength(2)
    expect(newsCards[0].props('news')).toEqual(mockNews[0])
    expect(newsCards[1].props('news')).toEqual(mockNews[1])
  })

  it('отображает сообщение при отсутствии новостей', async () => {
    const store = useNewsListStore()
    store.news = []
    store.loading = false

    wrapper = mount(NewsList, {
      global: {
        components: {
          NewsCard,
          AppLoader,
          AppError
        }
      }
    })

    expect(wrapper.find('.text-center').text()).toContain('Новости не найдены')
  })
}) 