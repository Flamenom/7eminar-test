<template>
  <div class="news-list">
    <!-- Поисковая строка -->
    <div class="row mb-4">
      <div class="col-md-6 mx-auto">
        <div class="input-group shadow-sm">
          <input 
            type="text" 
            class="form-control" 
            v-model="searchQuery" 
            placeholder="Search news..."
          >
          <button 
            class="btn btn-outline-secondary" 
            type="button"
            @click="clearSearch"
            v-if="searchQuery"
          >
            <span class="d-none d-sm-inline">Clear</span>
            <span class="d-inline d-sm-none">&times;</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <AppLoader v-if="newsListStore.loading" message="Loading news..." />

    <!-- Состояние ошибки -->
    <AppError 
      v-else-if="newsListStore.error" 
      :message="newsListStore.error"
      @retry="newsListStore.fetchNews"
    />

    <!-- Список новостей -->
    <template v-else>
      <!-- Заголовок с результатами -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 mb-0">
          {{ searchQuery ? 'Search results' : 'Latest news' }}
        </h2>
        <small v-if="searchQuery" class="text-muted">
          Found: {{ filteredNews.length }}
        </small>
      </div>
      
      <!-- Сетка новостей -->
      <div v-if="filteredNews.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="news in filteredNews" :key="news.id" class="col">
          <NewsCard :news="news" />
        </div>
      </div>

      <!-- Сообщение, если ничего не найдено -->
      <div v-else class="text-center py-5">
        <div class="empty-state">
          <i class="bi bi-search mb-3 display-4"></i>
          <p class="h4 text-muted">No results found for your search</p>
          <button 
            v-if="searchQuery" 
            class="btn btn-primary mt-3"
            @click="clearSearch"
          >
            Show all news
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useNewsListStore } from '~/stores/news'
import AppLoader from '~/components/AppLoader.vue'
import AppError from '~/components/AppError.vue'
import { ref, computed } from 'vue'

const newsListStore = useNewsListStore()
const searchQuery = ref<string>('')

// Функция фильтрации новостей
const filteredNews = computed(() => {
  if (!searchQuery.value) return newsListStore.news

  const query = searchQuery.value.toLowerCase()
  return newsListStore.news.filter(news => 
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
.input-group {
  border-radius: 0.375rem;
  overflow: hidden;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #dee2e6;
}

.input-group .btn {
  border-color: #dee2e6;
}

.empty-state {
  color: #6c757d;
}

.empty-state i {
  opacity: 0.5;
}

@media (max-width: 576px) {
  .input-group .btn {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style> 