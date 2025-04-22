<template>
  <div class="comment-item card mb-2">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <h6 class="card-subtitle mb-2">{{ comment.author }}</h6>
        <small class="text-muted">{{ formatDate(comment.date) }}</small>
      </div>
      <p class="card-text">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/stores/comments'

defineProps<{
  comment: Comment
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.comment-item {
  background-color: #f8f9fa;
  border-left: 4px solid #0d6efd;
}
</style> 