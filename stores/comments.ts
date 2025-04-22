import { defineStore } from 'pinia'

export interface Comment {
  id: number
  newsId: number
  author: string
  content: string
  date: string
}

interface CommentState {
  comments: Comment[]
  loading: boolean
  error: string | null
  wsConnected: boolean
  mockInterval: ReturnType<typeof setInterval> | null
}

export const useCommentsStore = defineStore('comments', {
  state: (): CommentState => ({
    comments: [],
    loading: false,
    error: null,
    wsConnected: false,
    mockInterval: null
  }),

  getters: {
    getCommentsByNewsId: (state) => (newsId: number) => {
      return state.comments
        .filter(comment => comment.newsId === newsId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  },

  actions: {
    async fetchComments(newsId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(`/api/comments?newsId=${newsId}`)
        this.comments = Array.isArray(response) ? response.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ) : []
        return this.comments
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error loading comments'
        console.error('Error fetching comments:', error)
        this.comments = []
        throw error
      } finally {
        this.loading = false
      }
    },

    async addComment(comment: Omit<Comment, 'id' | 'date'>) {
      this.error = null
      try {
        const response = await $fetch<Comment>('/api/comments', {
          method: 'POST',
          body: {
            newsId: comment.newsId,
            author: comment.author,
            content: comment.content
          }
        })
        
        this.comments.unshift(response)
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error adding comment'
        console.error('Error adding comment:', error)
        throw error
      }
    },

    receiveComment(comment: Comment) {
      if (comment && comment.id) {
        const exists = this.comments.some(c => c.id === comment.id)
        if (!exists) {
          this.comments.unshift(comment)
          this.comments = this.comments.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        }
      }
    },

    connectToWebSocket(newsId: number) {
      if (process.server || this.wsConnected) return

      console.log('Connecting to WebSocket...', newsId)

      let mockCommentId = Date.now()
      this.mockInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const mockComment: Comment = {
            id: mockCommentId++,
            newsId,
            author: `User ${Math.floor(Math.random() * 1000)}`,
            content: `Test comment ${mockCommentId}`,
            date: new Date().toISOString()
          }
          this.receiveComment(mockComment)
        }
      }, 10000)

      this.wsConnected = true
    },

    disconnectWebSocket() {
      if (this.mockInterval) {
        clearInterval(this.mockInterval)
        this.mockInterval = null
      }
      this.wsConnected = false
    }
  }
}) 