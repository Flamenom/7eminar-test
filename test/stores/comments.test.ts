import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCommentsStore } from '~/stores/comments'

describe('Comments Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
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
    expect(store.comments[0].id).toBe(2) // Более новый комментарий должен быть первым
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
}) 