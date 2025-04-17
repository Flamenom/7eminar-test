<template>
  <div class="card h-100">
    <img :src="news.image" class="card-img-top" :alt="news.title">
    <div class="card-body">
      <h5 class="card-title">{{ news.title }}</h5>
      <p class="card-text">{{ news.description }}</p>
      <NuxtLink :to="`/news/${news.id}`" class="btn btn-primary">
        Читать далее
      </NuxtLink>
    </div>
    <div class="card-footer text-muted">
      {{ formatDate(news.date) }}
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

const props = defineProps<{
  news: News
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.card-text {
  color: #6c757d;
}
</style> 