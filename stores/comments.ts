import { defineStore } from 'pinia'

interface Comment {
  id: number
  newsId: number
  author: string
  text: string
  date: string
}

interface CommentsState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

export const useCommentsStore = defineStore('comments', {
  state: (): CommentsState => ({
    comments: [],
    loading: false,
    error: null
  }),

  getters: {
    getCommentsByNewsId: (state) => (newsId: number) => {
      return state.comments.filter(comment => comment.newsId === newsId)
    }
  },

  actions: {
    async fetchComments() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/data/comments.json')
        const data = await response.json()
        this.comments = data.comments
      } catch (error) {
        this.error = 'Ошибка при загрузке комментариев'
        console.error('Error fetching comments:', error)
      } finally {
        this.loading = false
      }
    },

    async addComment(comment: Omit<Comment, 'id'>) {
      try {
        // В реальном приложении здесь был бы POST запрос
        const newComment = {
          ...comment,
          id: this.comments.length + 1
        }
        this.comments.push(newComment)
        return newComment
      } catch (error) {
        this.error = 'Ошибка при добавлении комментария'
        console.error('Error adding comment:', error)
        throw error
      }
    }
  }
}) 