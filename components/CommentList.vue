<template>
  <div class="comments-list">
    <div v-if="comments?.length" class="list-group">
      <CommentItem 
        v-for="comment in comments" 
        :key="comment.id"
        :comment="comment"
      />
    </div>
    
    <!-- No comments yet. Be the first to comment! -->
    <div v-else class="text-center text-muted py-4">
      <i class="bi bi-chat-left text-muted display-4"></i>
      <p class="mt-3">No comments yet. Be the first to comment!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/stores/comments'
import CommentItem from '~/components/CommentItem.vue'

defineProps<{
  comments?: Comment[]
}>()
</script>

<style scoped>
.comments-list {
  margin-top: 1rem;
}
</style> 