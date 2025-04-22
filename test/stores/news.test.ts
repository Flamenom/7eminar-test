import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { useNewsListStore } from '~/stores/news'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const mockConsoleError = vi.fn()
vi.stubGlobal('console', {
  error: mockConsoleError,
  log: vi.fn(),
  warn: vi.fn(),
  info: vi.fn()
})

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

    mockFetch.mockRejectedValueOnce(error)

    await store.fetchNews()

    expect(store.loading).toBe(false)
    expect(store.error).toBe(errorMessage)
    expect(store.news).toEqual([])
    expect(mockFetch).toHaveBeenCalledWith('/api/news')
    expect(mockConsoleError).toHaveBeenCalledWith('Error fetching news:', error)
  })

  it('handles invalid data format', async () => {
    const store = useNewsListStore()

    mockFetch.mockResolvedValueOnce(null)

    await store.fetchNews()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Неверный формат данных')
    expect(store.news).toEqual([])
    expect(mockFetch).toHaveBeenCalledWith('/api/news')
  })

  it('handles empty response', async () => {
    const store = useNewsListStore()

    mockFetch.mockResolvedValueOnce([])

    await store.fetchNews()

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.news).toEqual([])
    expect(mockFetch).toHaveBeenCalledWith('/api/news')
  })

  it('handles malformed news items', async () => {
    const store = useNewsListStore()
    const date = new Date().toISOString()
    const malformedNews = [
      { id: 1, title: 'News 1' },
      { id: 2, title: 'News 2', description: 'Description 2', image: 'test2.jpg', date, content: 'Content 2' }
    ]

    mockFetch.mockResolvedValueOnce(malformedNews)

    await store.fetchNews()

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.news).toEqual(malformedNews)
    expect(mockFetch).toHaveBeenCalledWith('/api/news')
  })
}) 