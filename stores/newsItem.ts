import { defineStore } from 'pinia'

interface NewsItem {
  id: number
  title: string
  description: string
  image: string
  date: string
  content: string
}

interface NewsItemState {
  news: NewsItem | null
  loading: boolean
  error: string | null
}

export const useNewsItemStore = defineStore('newsItem', {
  state: (): NewsItemState => ({
    news: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchNewsItem(id: number) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useFetch(`/api/news/${id}`)
        if (error.value) {
          throw new Error(error.value.message)
        }
        this.news = data.value as NewsItem
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Произошла ошибка при загрузке новости'
        console.error('Error fetching news item:', error)
      } finally {
        this.loading = false
      }
    }
  }
}) 