<template>
  <div class="container py-4">
    <div v-if="currentNews" class="news-article">
      <!-- Изображение новости -->
      <img :src="currentNews.image" :alt="currentNews.title" class="news-image mb-4">
      
      <!-- Заголовок и дата -->
      <h1 class="mb-3">{{ currentNews.title }}</h1>
      <p class="text-muted mb-4">{{ formatDate(currentNews.date) }}</p>
      
      <!-- Полный текст новости -->
      <div class="news-content">
        <p>{{ currentNews.description }}</p>
        <p>{{ currentNews.fullContent }}</p>
      </div>
      
      <!-- Кнопка возврата -->
      <NuxtLink to="/" class="btn btn-outline-primary mt-4">
        ← Вернуться к списку новостей
      </NuxtLink>
    </div>
    
    <!-- Сообщение об ошибке -->
    <div v-else class="text-center py-5">
      <h2>Новость не найдена</h2>
      <p class="text-muted">Запрашиваемая новость не существует или была удалена</p>
      <NuxtLink to="/" class="btn btn-primary mt-3">
        Вернуться на главную
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

interface News {
  id: number
  title: string
  description: string
  image: string
  date: string
  fullContent?: string
}

// Временные данные (в реальном приложении здесь будет API запрос)
const newsData = ref<News[]>([
  {
    id: 1,
    title: 'Первая новость',
    description: 'Краткое описание первой новости. Здесь может быть ваш текст.',
    image: 'https://picsum.photos/800/400',
    date: '2024-03-19',
    fullContent: 'Полный текст первой новости. Здесь будет размещено подробное описание новости, включая все детали и подробности события. В реальном приложении этот текст будет загружаться из базы данных или API.'
  },
  {
    id: 2,
    title: 'Вторая новость',
    description: 'Краткое описание второй новости. Это демонстрационный текст.',
    image: 'https://picsum.photos/800/400',
    date: '2024-03-18',
    fullContent: 'Полный текст второй новости. Здесь будет размещено подробное описание новости, включая все детали и подробности события. В реальном приложении этот текст будет загружаться из базы данных или API.'
  },
  {
    id: 3,
    title: 'Третья новость',
    description: 'Краткое описание третьей новости. Здесь будет ваш контент.',
    image: 'https://picsum.photos/800/400',
    date: '2024-03-17',
    fullContent: 'Полный текст третьей новости. Здесь будет размещено подробное описание новости, включая все детали и подробности события. В реальном приложении этот текст будет загружаться из базы данных или API.'
  }
])

const currentNews = computed(() => {
  const id = Number(route.params.id)
  return newsData.value.find(item => item.id === id)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.news-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.news-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
}

.news-content p {
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 800px;
  }
}
</style> 