<template>
  <div class="card mb-4">
    <div class="card-body">
      <form @submit.prevent="submitComment">
        <div class="mb-3">
          <label for="author" class="form-label">Your name</label>
          <input 
            type="text" 
            class="form-control" 
            id="author" 
            v-model="newComment.author"
            required
            :disabled="disabled"
          >
        </div>
        <div class="mb-3">
          <label for="content" class="form-label">Your comment</label>
          <textarea 
            class="form-control" 
            id="content" 
            rows="3" 
            v-model="newComment.content"
            required
            :disabled="disabled"
          ></textarea>
        </div>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="disabled || isSubmitting"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', comment: { author: string; content: string }): void
}>()

const isSubmitting = ref(false)
const newComment = ref({
  author: '',
  content: ''
})

const submitComment = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    emit('submit', { ...newComment.value })
    newComment.value.author = ''
    newComment.value.content = ''
    await new Promise(resolve => setTimeout(resolve, 100))
  } catch (error) {
    console.error('Error submitting comment:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script> 