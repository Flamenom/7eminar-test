import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { useNewsListStore } from '~/stores/news'

// Мокаем глобальный $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Мокаем console.error чтобы не засорять вывод тестов
const mockConsoleError = vi.fn()
vi.stubGlobal('console', {
  error: mockConsoleError,
  log: vi.fn(),
  warn: vi.fn(),
  info: vi.fn()
})

// Мокаем useFetch
vi.mock('#app', () => ({
  useFetch: vi.fn((url, options) => {
    const data = ref(null)
    const pending = ref(false)
    const error = ref(null)
    const refresh = vi.fn()
    const execute = vi.fn()

    return {
      data,
      pending,
      error,
      refresh,
      execute
    }
  })
}))

describe('News Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Очищаем моки перед каждым тестом
    vi.clearAllMocks()
  })

  it('initializes with empty state', () => {
    const store = useNewsListStore()
    expect(store.news).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('searches news by query', () => {
    const store = useNewsListStore()
    const date = new Date().toISOString()
    store.news = [
      { id: 1, title: 'Test News 1', description: 'Description 1', image: 'test1.jpg', date, content: 'Content 1' },
      { id: 2, title: 'Another News', description: 'Description 2', image: 'test2.jpg', date, content: 'Content 2' },
      { id: 3, title: 'Third Test', description: 'Test description', image: 'test3.jpg', date, content: 'Content 3' }
    ]

    const filtered = store.searchNews('test')
    expect(filtered).toHaveLength(2)
    expect(filtered[0].id).toBe(1)
    expect(filtered[1].id).toBe(3)
  })

  it('returns all news when search query is empty', () => {
    const store = useNewsListStore()
    const date = new Date().toISOString()
    const newsItems = [
      { id: 1, title: 'Test News 1', description: 'Description 1', image: 'test1.jpg', date, content: 'Content 1' },
      { id: 2, title: 'Another News', description: 'Description 2', image: 'test2.jpg', date, content: 'Content 2' }
    ]
    store.news = newsItems

    expect(store.searchNews('')).toEqual(newsItems)
  })

  it('handles case-insensitive search', () => {
    const store = useNewsListStore()
    const date = new Date().toISOString()
    store.news = [
      { id: 1, title: 'TEST News', description: 'Description', image: 'test1.jpg', date, content: 'Content 1' },
      { id: 2, title: 'Another News', description: 'test in description', image: 'test2.jpg', date, content: 'Content 2' }
    ]

    const filtered = store.searchNews('test')
    expect(filtered).toHaveLength(2)
  })

  it('finds news by ID', () => {
    const store = useNewsListStore()
    const date = new Date().toISOString()
    const newsItem = { 
      id: 1, 
      title: 'Test News', 
      description: 'Description',
      image: 'test.jpg',
      date,
      content: 'Content'
    }
    store.news = [newsItem]

    expect(store.getNewsById(1)).toEqual(newsItem)
    expect(store.getNewsById(2)).toBeUndefined()
  })

  it('handles async fetchNews success', async () => {
    const store = useNewsListStore()
    const date = new Date().toISOString()
    const mockNews = [
      { id: 1, title: 'News 1', description: 'Description 1', image: 'test1.jpg', date, content: 'Content 1' },
      { id: 2, title: 'News 2', description: 'Description 2', image: 'test2.jpg', date, content: 'Content 2' }
    ]

    // Мокаем успешный ответ
    mockFetch.mockResolvedValueOnce(mockNews)

    await store.fetchNews()

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.news).toEqual(mockNews)
    expect(mockFetch).toHaveBeenCalledWith('/api/news')
  })

  it('handles async fetchNews error', async () => {
    const store = useNewsListStore()
    const errorMessage = 'Failed to fetch news'
    const error = new Error(errorMessage)

    // Мокаем ошибку
    mockFetch.mockRejectedValueOnce(error)

    // Запускаем fetchNews
    await store.fetchNews()

    // Проверяем состояние после ошибки
    expect(store.loading).toBe(false)
    expect(store.error).toBe(errorMessage)
    expect(store.news).toEqual([])
    expect(mockFetch).toHaveBeenCalledWith('/api/news')
    expect(mockConsoleError).toHaveBeenCalledWith('Error fetching news:', error)
  })

  it('handles invalid data format', async () => {
    const store = useNewsListStore()

    // Мокаем неверный формат данных
    mockFetch.mockResolvedValueOnce(null)

    await store.fetchNews()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Неверный формат данных')
    expect(store.news).toEqual([])
    expect(mockFetch).toHaveBeenCalledWith('/api/news')
  })
}) 