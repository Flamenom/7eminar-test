<template>
  <div class="card h-100 shadow-sm news-card">
    <img 
      :src="news.image" 
      class="card-img-top" 
      :alt="news.title"
      loading="lazy"
    >
    <div class="card-body d-flex flex-column">
      <h5 class="card-title text-truncate-2">{{ news.title }}</h5>
      <p class="card-text text-truncate-3 text-muted">{{ news.description }}</p>
      <div class="mt-auto d-flex justify-content-between align-items-center">
        <small class="text-muted">
          <i class="bi bi-calendar me-1"></i>
          {{ formattedDate }}
        </small>
        <NuxtLink :to="`/news/${news.id}`" class="btn btn-primary btn-sm">
          Read more
          <i class="bi bi-arrow-right ms-1"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface News {
  id: number
  title: string
  description: string
  image: string
  date: string
}

const props = defineProps<{
  news: News
}>()

const formattedDate = computed(() => {
  return new Date(props.news.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style scoped>
.news-card {
  transition: transform 0.2s ease-in-out;
}

.news-card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3rem;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 4.5rem;
}
</style> 