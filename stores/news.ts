import { defineStore } from 'pinia'

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  date: string
  content: string
}

interface NewsState {
  news: NewsItem[]
  loading: boolean
  error: string | null
}

export const useNewsListStore = defineStore('newsList', {
  state: (): NewsState => ({
    news: [],
    loading: false,
    error: null
  }),

  getters: {
    getNewsById: (state) => (id: number) => {
      return state.news.find(item => item.id === id)
    },
    searchNews: (state) => (query: string) => {
      const searchQuery = query.toLowerCase()
      return state.news.filter(item => 
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery)
      )
    }
  },

  actions: {
    async fetchNews() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch('/api/news')
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Неверный формат данных')
        }
        
        this.news = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Ошибка при загрузке новостей'
        console.error('Error fetching news:', error)
      } finally {
        this.loading = false
      }
    }
  }
}) 