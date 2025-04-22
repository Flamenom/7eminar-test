<template>
  <div class="container py-4">
    <!-- Состояние загрузки -->
    <AppLoader v-if="newsItemStore.loading" message="Загрузка новости..." />

    <!-- Состояние ошибки -->
    <AppError 
      v-else-if="newsItemStore.error" 
      :message="newsItemStore.error"
      @retry="fetchNewsItem"
    />

    <!-- Контент новости -->
    <div v-else-if="newsItemStore.news" class="news-article">
      <!-- Изображение новости -->
      <img :src="newsItemStore.news.image" :alt="newsItemStore.news.title" class="news-image mb-4">
      
      <!-- Заголовок и дата -->
      <div class="mb-4">
        <h1 class="mb-2">{{ newsItemStore.news.title }}</h1>
        <div class="d-flex align-items-center text-muted">
          <i class="bi bi-calendar me-2"></i>
          <span>{{ formatDate(newsItemStore.news.date) }}</span>
        </div>
      </div>
      
      <!-- Полный текст новости -->
      <div class="news-content">
        <p class="lead mb-4">{{ newsItemStore.news.description }}</p>
        <div v-html="newsItemStore.news.content"></div>
      </div>
      
      <!-- Кнопка возврата -->
      <div class="mt-5">
        <NuxtLink to="/" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left me-2"></i>
          Back to News List
        </NuxtLink>
      </div>

      <!-- Комментарии -->
      <NewsComments v-if="newsItemStore.news" :news-id="newsItemStore.news.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewsItemStore } from '~/stores/newsItem'
import AppLoader from '~/components/AppLoader.vue'
import AppError from '~/components/AppError.vue'

const route = useRoute()
const newsItemStore = useNewsItemStore()

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchNewsItem = () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    newsItemStore.error = 'Неверный ID новости'
    return
  }
  newsItemStore.fetchNewsItem(id)
}

// Предзагрузка данных на сервере
await useAsyncData(`news-${route.params.id}`, async () => {
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    await newsItemStore.fetchNewsItem(id)
    return newsItemStore.news
  }
  return null
})
</script>

<style scoped>
.news-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
}

.news-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
}

.news-content :deep(p) {
  margin-bottom: 1.5rem;
}

.news-content :deep(ul) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.news-content :deep(li) {
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 800px;
  }
}
</style> 