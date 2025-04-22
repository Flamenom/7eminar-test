import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import NewsComments from '~/components/NewsComments.vue'
import CommentForm from '~/components/CommentForm.vue'
import CommentList from '~/components/CommentList.vue'
import AppLoader from '~/components/AppLoader.vue'
import AppError from '~/components/AppError.vue'
import { useCommentsStore } from '~/stores/comments'

// Мокаем store
vi.mock('~/stores/comments', () => ({
  useCommentsStore: vi.fn(() => ({
    comments: [],
    fetchComments: vi.fn(),
    receiveComment: vi.fn(),
    connectToWebSocket: vi.fn(),
    disconnectWebSocket: vi.fn()
  }))
}))

// Мокаем composables
vi.mock('#imports', () => ({
  useAsyncData: vi.fn(() => ({
    data: ref([]),
    pending: ref(false),
    error: ref(null),
    refresh: vi.fn(),
    execute: vi.fn(),
    clear: vi.fn(),
    status: ref('idle')
  })),
  useFetch: vi.fn(() => ({
    data: ref(null),
    error: ref(null),
    pending: ref(false),
    refresh: vi.fn(),
    execute: vi.fn(),
    clear: vi.fn(),
    status: ref('idle')
  }))
}))

describe('NewsComments', () => {
  let wrapper: any
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('отображает форму комментария', async () => {
    wrapper = mount(NewsComments, {
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

    await flushPromises()
    expect(wrapper.findComponent(CommentForm).exists()).toBe(true)
  })

  it('отображает загрузчик во время загрузки', async () => {
    vi.mocked(useAsyncData).mockReturnValueOnce(Promise.resolve({
      data: ref([]),
      pending: ref(true),
      error: ref(null),
      refresh: vi.fn(),
      execute: vi.fn(),
      clear: vi.fn(),
      status: ref('pending')
    }))

    wrapper = mount(NewsComments, {
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

    await flushPromises()
    expect(wrapper.findComponent(AppLoader).exists()).toBe(true)
  })

  it('отображает ошибку при наличии ошибки', async () => {
    const errorMessage = 'Test error message'
    vi.mocked(useAsyncData).mockReturnValueOnce(Promise.resolve({
      data: ref([]),
      pending: ref(false),
      error: ref({
        message: errorMessage,
        statusCode: 500,
        fatal: false,
        unhandled: false,
        name: 'NuxtError',
        toJSON: () => ({ message: errorMessage, statusCode: 500 })
      }),
      refresh: vi.fn(),
      execute: vi.fn(),
      clear: vi.fn(),
      status: ref('error')
    }))

    wrapper = mount(NewsComments, {
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

    await flushPromises()
    expect(wrapper.findComponent(AppError).exists()).toBe(true)
    expect(wrapper.findComponent(AppError).props('message')).toBe(errorMessage)
  })

  it('отображает список комментариев', async () => {
    const store = useCommentsStore()
    store.comments = mockComments

    vi.mocked(useAsyncData).mockReturnValueOnce(Promise.resolve({
      data: ref(mockComments),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
      execute: vi.fn(),
      clear: vi.fn(),
      status: ref('success')
    }))

    wrapper = mount(NewsComments, {
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

    await flushPromises()
    expect(wrapper.findComponent(CommentList).exists()).toBe(true)
    expect(wrapper.findComponent(CommentList).props('comments')).toEqual(mockComments)
  })

  it('отправляет новый комментарий', async () => {
    const store = useCommentsStore()
    const newComment = {
      author: 'New Author',
      content: 'New Content'
    }

    vi.mocked(useAsyncData).mockReturnValueOnce(Promise.resolve({
      data: ref([]),
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn(),
      execute: vi.fn(),
      clear: vi.fn(),
      status: ref('success')
    }))

    vi.mocked(useFetch).mockReturnValueOnce(Promise.resolve({
      data: ref({ id: 1, ...newComment, date: new Date().toISOString() }),
      error: ref(null),
      pending: ref(false),
      refresh: vi.fn(),
      execute: vi.fn(),
      clear: vi.fn(),
      status: ref('success')
    }))

    wrapper = mount(NewsComments, {
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

    await flushPromises()
    await wrapper.findComponent(CommentForm).vm.$emit('submit', newComment)

    expect(store.receiveComment).toHaveBeenCalled()
  })
}) 