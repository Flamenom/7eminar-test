<template>
  <div class="container py-4">
    <NewsList />
  </div>
</template>

<script setup lang="ts">
import { useNewsListStore } from '~/stores/news'

const newsListStore = useNewsListStore()

// Предзагрузка данных на сервере
await useAsyncData('newsList', async () => {
  await newsListStore.fetchNews()
  return newsListStore.news
})
</script>

<style scoped>
.container {
  min-height: calc(100vh - 160px); /* Учитываем высоту навбара и футера */
}
</style> 