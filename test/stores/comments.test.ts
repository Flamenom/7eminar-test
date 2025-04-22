import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCommentsStore } from '~/stores/comments'

const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn()
}

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

vi.stubGlobal('WebSocket', vi.fn(() => mockWebSocket))

describe('Comments Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with empty state', () => {
    const store = useCommentsStore()
    expect(store.comments).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.wsConnected).toBe(false)
  })

  it('receives and sorts comments correctly', () => {
    const store = useCommentsStore()
    const comment1 = {
      id: 1,
      newsId: 1,
      author: 'User1',
      content: 'Comment 1',
      date: '2024-03-10T10:00:00Z'
    }
    const comment2 = {
      id: 2,
      newsId: 1,
      author: 'User2',
      content: 'Comment 2',
      date: '2024-03-10T11:00:00Z'
    }

    store.receiveComment(comment1)
    store.receiveComment(comment2)

    expect(store.comments).toHaveLength(2)
    expect(store.comments[0].id).toBe(2)
    expect(store.comments[1].id).toBe(1)
  })

  it('prevents duplicate comments', () => {
    const store = useCommentsStore()
    const comment = {
      id: 1,
      newsId: 1,
      author: 'User1',
      content: 'Comment 1',
      date: '2024-03-10T10:00:00Z'
    }

    store.receiveComment(comment)
    store.receiveComment(comment)

    expect(store.comments).toHaveLength(1)
  })

  it('connects to WebSocket', () => {
    const store = useCommentsStore()
    store.connectToWebSocket(1)

    expect(store.wsConnected).toBe(true)
    expect(store.mockInterval).not.toBeNull()
  })

  it('handles WebSocket connection error', () => {
    const store = useCommentsStore()
    const error = new Error('Connection failed')
    vi.mocked(WebSocket).mockImplementationOnce(() => {
      throw error
    })

    store.connectToWebSocket(1)

    expect(store.wsConnected).toBe(true)
    expect(store.error).toBeNull()
  })

  it('adds comment through API', async () => {
    const store = useCommentsStore()
    const comment = {
      newsId: 1,
      author: 'User1',
      content: 'Test comment'
    }

    const mockResponse = {
      id: 1,
      ...comment,
      date: new Date().toISOString()
    }

    mockFetch.mockResolvedValueOnce(mockResponse)

    await store.addComment(comment)

    expect(store.comments).toHaveLength(1)
    expect(store.comments[0].author).toBe('User1')
    expect(store.comments[0].content).toBe('Test comment')
    expect(mockFetch).toHaveBeenCalledWith('/api/comments', {
      method: 'POST',
      body: comment
    })
  })

  it('handles invalid comment data', () => {
    const store = useCommentsStore()
    const invalidComment = {
      id: 1,
      newsId: 1,
      author: 'User1',
      content: 'Test comment',
      date: 'invalid-date'
    }

    store.receiveComment(invalidComment)

    expect(store.comments).toHaveLength(1)
    expect(store.comments[0]).toEqual(invalidComment)
  })

  it('closes WebSocket connection', () => {
    const store = useCommentsStore()
    store.connectToWebSocket(1)
    store.disconnectWebSocket()

    expect(store.wsConnected).toBe(false)
    expect(store.mockInterval).toBeNull()
  })
}) 