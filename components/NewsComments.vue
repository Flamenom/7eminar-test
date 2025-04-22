<template>
  <div class="news-comments">
    <h3 class="mb-4">Comments</h3>
    
    <CommentForm @submit="handleSubmit" />
    
    <AppLoader v-if="pending" message="Loading comments..." />
    
    <AppError v-else-if="error" :error="error" />
    
    <CommentList v-else :comments="comments" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useCommentsStore } from '~/stores/comments'
import CommentForm from '~/components/CommentForm.vue'
import CommentList from '~/components/CommentList.vue'
import AppLoader from '~/components/AppLoader.vue'
import AppError from '~/components/AppError.vue'

interface Comment {
  id: number
  newsId: number
  author: string
  content: string
  date: string
}

const props = defineProps<{
  newsId: number
}>()

const store = useCommentsStore()
const comments = ref<Comment[]>([])
const pending = ref(false)
const error = ref<Error | null>(null)

// Загрузка комментариев
const loadComments = async () => {
  try {
    pending.value = true
    const result = await store.fetchComments(props.newsId)
    console.log('Loaded comments:', result) // Отладочная информация
    comments.value = result
  } catch (err) {
    error.value = err as Error
  } finally {
    pending.value = false
  }
}

// Инициализация
onMounted(() => {
  loadComments()
})

// Обработка отправки нового комментария
const handleSubmit = async (comment: Omit<Comment, 'id' | 'date'>) => {
  try {
    await store.addComment({
      ...comment,
      newsId: props.newsId,
      id: Date.now(),
      date: new Date().toISOString()
    })
    // Обновляем список комментариев
    await loadComments()
  } catch (err) {
    error.value = err as Error
  }
}
</script>

<style scoped>
.news-comments {
  margin-top: 2rem;
}
</style> 