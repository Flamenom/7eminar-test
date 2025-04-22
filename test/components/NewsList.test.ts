import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import NewsList from '~/components/NewsList.vue'
import NewsCard from '~/components/NewsCard.vue'
import AppLoader from '~/components/AppLoader.vue'
import AppError from '~/components/AppError.vue'
import { useNewsListStore } from '~/stores/news'

// Mock store
vi.mock('~/stores/news', () => ({
  useNewsListStore: vi.fn()
}))

// Mock composables
vi.mock('#imports', () => ({
  useAsyncData: vi.fn(() => ({
    data: ref([]),
    pending: ref(false),
    error: ref(null),
    refresh: vi.fn()
  }))
}))

describe('NewsList', () => {
  let wrapper: VueWrapper
  let store: any

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

  const mountComponent = () => {
    return mount(NewsList, {
      global: {
        components: {
          NewsCard,
          AppLoader,
          AppError
        },
        stubs: {
          'i': true // Stub Bootstrap icons
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup store mock for each test
    store = {
      news: [],
      loading: false,
      error: null,
      fetchNews: vi.fn()
    }
    
    vi.mocked(useNewsListStore).mockReturnValue(store)
  })

  it('shows loader while loading', () => {
    store.loading = true
    wrapper = mountComponent()
    
    expect(wrapper.findComponent(AppLoader).exists()).toBe(true)
    expect(wrapper.findComponent(AppLoader).props('message')).toBe('Loading news...')
  })

  it('shows error when there is an error', () => {
    store.error = 'Test error message'
    wrapper = mountComponent()
    
    const errorComponent = wrapper.findComponent(AppError)
    expect(errorComponent.exists()).toBe(true)
    expect(errorComponent.props('message')).toBe('Test error message')
  })

  it('displays news list', () => {
    store.news = mockNews
    wrapper = mountComponent()
    
    const newsCards = wrapper.findAllComponents(NewsCard)
    expect(newsCards).toHaveLength(2)
    expect(newsCards[0].props('news')).toEqual(mockNews[0])
    expect(newsCards[1].props('news')).toEqual(mockNews[1])
  })

  it('shows empty state when no news found', () => {
    store.news = []
    wrapper = mountComponent()
    
    const emptyState = wrapper.find('.empty-state')
    expect(emptyState.exists()).toBe(true)
    expect(emptyState.text()).toContain('No results found for your search')
  })

  it('filters news based on search query', async () => {
    store.news = mockNews
    wrapper = mountComponent()
    
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Test News 1')
    
    const newsCards = wrapper.findAllComponents(NewsCard)
    expect(newsCards).toHaveLength(1)
    expect(newsCards[0].props('news')).toEqual(mockNews[0])
  })

  it('clears search when clear button is clicked', async () => {
    store.news = mockNews
    wrapper = mountComponent()
    
    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('Test')
    
    const clearButton = wrapper.find('button')
    await clearButton.trigger('click')
    
    const inputElement = searchInput.element as HTMLInputElement
    expect(inputElement.value).toBe('')
    const newsCards = wrapper.findAllComponents(NewsCard)
    expect(newsCards).toHaveLength(2)
  })
}) 