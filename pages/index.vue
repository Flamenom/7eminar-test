<template>
  <div class="container h-100 py-4">
    <!-- Поисковая строка -->
    <div class="row mb-4">
      <div class="col-md-6 mx-auto">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            v-model="searchQuery" 
            placeholder="Поиск новостей..."
          >
          <button 
            class="btn btn-outline-secondary" 
            type="button"
            @click="clearSearch"
          >
            Очистить
          </button>
        </div>
      </div>
    </div>

    <h1 class="mb-4">
      {{ searchQuery ? 'Результаты поиска' : 'Последние новости' }}
      <small v-if="searchQuery" class="text-muted">
        (найдено: {{ filteredNews.length }})
      </small>
    </h1>
    
    <!-- Список новостей -->
    <div v-if="filteredNews.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="news in filteredNews" :key="news.id" class="col">
        <NewsCard :news="news" />
      </div>
    </div>

    <!-- Сообщение, если ничего не найдено -->
    <div v-else class="text-center py-5">
      <p class="h4 text-muted">По вашему запросу ничего не найдено</p>
      <button 
        v-if="searchQuery" 
        class="btn btn-primary mt-3"
        @click="clearSearch"
      >
        Показать все новости
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface News {
  id: number
  title: string
  description: string
  image: string
  date: string
}

// Временные данные для демонстрации
const newsList = ref<News[]>([
  {
    id: 1,
    title: 'Первая новость',
    description: 'Краткое описание первой новости. Здесь может быть ваш текст.',
    image: 'https://picsum.photos/800/400',
    date: '2024-03-19'
  },
  {
    id: 2,
    title: 'Вторая новость',
    description: 'Краткое описание второй новости. Это демонстрационный текст.',
    image: 'https://picsum.photos/800/400',
    date: '2024-03-18'
  },
  {
    id: 3,
    title: 'Третья новость',
    description: 'Краткое описание третьей новости. Здесь будет ваш контент.',
    image: 'https://picsum.photos/800/400',
    date: '2024-03-17'
  }
])

const searchQuery = ref('')

// Функция фильтрации новостей
const filteredNews = computed(() => {
  if (!searchQuery.value) return newsList.value

  const query = searchQuery.value.toLowerCase()
  return newsList.value.filter(news => 
    news.title.toLowerCase().includes(query) || 
    news.description.toLowerCase().includes(query)
  )
})

// Функция очистки поиска
const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<style scoped>
.container {
  min-height: calc(100vh - 160px); /* Учитываем высоту навбара и футера */
}

.input-group {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #dee2e6;
}

.input-group .btn {
  border-color: #dee2e6;
}
</style> 