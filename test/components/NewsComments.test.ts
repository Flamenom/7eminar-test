import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, VueWrapper } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import NewsComments from '~/components/NewsComments.vue'
import CommentForm from '~/components/CommentForm.vue'
import CommentList from '~/components/CommentList.vue'
import AppLoader from '~/components/AppLoader.vue'
import AppError from '~/components/AppError.vue'
import { useCommentsStore } from '~/stores/comments'

// Mock store
vi.mock('~/stores/comments', () => ({
  useCommentsStore: vi.fn()
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

describe('NewsComments', () => {
  let wrapper: VueWrapper
  let store: any

  const mockComments = [
    {
      id: 1,
      newsId: 1,
      author: 'Test Author 1',
      content: 'Test Content 1',
      date: '2024-01-01'
    },
    {
      id: 2,
      newsId: 1,
      author: 'Test Author 2',
      content: 'Test Content 2',
      date: '2024-01-02'
    }
  ]

  const mountComponent = () => {
    return mount(NewsComments, {
      props: {
        newsId: 1
      },
      global: {
        components: {
          CommentForm,
          CommentList,
          AppLoader,
          AppError
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup store mock for each test
    store = {
      comments: [],
      fetchComments: vi.fn().mockResolvedValue([]),
      addComment: vi.fn().mockResolvedValue({}),
      connectToWebSocket: vi.fn(),
      disconnectWebSocket: vi.fn()
    }
    
    vi.mocked(useCommentsStore).mockReturnValue(store)
  })

  it('displays comments section title', async () => {
    wrapper = mountComponent()
    await flushPromises()
    
    expect(wrapper.find('h3').text()).toBe('Comments')
  })

  it('displays comment form and list', async () => {
    store.fetchComments.mockResolvedValue(mockComments)
    wrapper = mountComponent()
    await flushPromises()
    
    expect(wrapper.findComponent(CommentForm).exists()).toBe(true)
    expect(wrapper.findComponent(CommentList).exists()).toBe(true)
    expect(wrapper.findComponent(CommentList).props('comments')).toEqual(mockComments)
  })

  it('displays loader during loading', async () => {
    // Create a Promise that never resolves
    const loadingPromise = new Promise(() => {})
    store.fetchComments.mockReturnValue(loadingPromise)
    
    wrapper = mountComponent()
    await nextTick() // Wait for Vue to update the DOM
    
    expect(wrapper.findComponent(AppLoader).exists()).toBe(true)
    expect(wrapper.findComponent(AppLoader).props('message')).toBe('Loading comments...')
  })

  it('displays error when loading fails', async () => {
    const errorMessage = 'Test error message'
    store.fetchComments.mockRejectedValue(new Error(errorMessage))
    
    wrapper = mountComponent()
    await flushPromises()
    
    const errorComponent = wrapper.findComponent(AppError)
    expect(errorComponent.exists()).toBe(true)
    expect(errorComponent.props('message')).toBe(errorMessage)
  })

  it('handles new comment submission', async () => {
    const newComment = {
      author: 'New Author',
      content: 'New Content'
    }
    
    wrapper = mountComponent()
    await flushPromises()
    
    await wrapper.findComponent(CommentForm).vm.$emit('submit', newComment)
    await flushPromises()
    
    expect(store.addComment).toHaveBeenCalledWith(expect.objectContaining({
      ...newComment,
      newsId: 1
    }))
    expect(store.fetchComments).toHaveBeenCalledWith(1)
  })

  it('handles comment submission error', async () => {
    const errorMessage = 'Failed to add comment'
    store.addComment.mockRejectedValue(new Error(errorMessage))
    
    wrapper = mountComponent()
    await flushPromises()
    
    await wrapper.findComponent(CommentForm).vm.$emit('submit', {
      author: 'New Author',
      content: 'New Content'
    })
    await flushPromises()
    
    const errorComponent = wrapper.findComponent(AppError)
    expect(errorComponent.exists()).toBe(true)
    expect(errorComponent.props('message')).toBe(errorMessage)
  })
}) 