import { defineStore } from 'pinia'

interface NewsItem {
  id: number
  title: string
  date: string
  shortDescription: string
  fullDescription: string
  author: string
}

interface NewsState {
  news: NewsItem[]
  loading: boolean
  error: string | null
}

export const useNewsStore = defineStore('news', {
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
        item.shortDescription.toLowerCase().includes(searchQuery) ||
        item.fullDescription.toLowerCase().includes(searchQuery)
      )
    }
  },

  actions: {
    async fetchNews() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/data/news.json')
        const data = await response.json()
        this.news = data.news
      } catch (error) {
        this.error = 'Ошибка при загрузке новостей'
        console.error('Error fetching news:', error)
      } finally {
        this.loading = false
      }
    }
  }
}) 