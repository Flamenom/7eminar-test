<template>
  <div class="card mb-4">
    <div class="card-body">
      <form @submit.prevent="handleSubmit" ref="form">
        <div class="mb-3">
          <label for="author" class="form-label">Your name</label>
          <input 
            type="text" 
            class="form-control" 
            id="author" 
            v-model="formData.author"
            required
            :disabled="disabled || isSubmitting"
            @input="validateField('author')"
          >
          <div v-if="errors.author" class="invalid-feedback d-block">
            {{ errors.author }}
          </div>
        </div>
        <div class="mb-3">
          <label for="content" class="form-label">Your comment</label>
          <textarea 
            class="form-control" 
            id="content" 
            rows="3" 
            v-model="formData.content"
            required
            :disabled="disabled || isSubmitting"
            @input="validateField('content')"
          ></textarea>
          <div v-if="errors.content" class="invalid-feedback d-block">
            {{ errors.content }}
          </div>
        </div>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="disabled || isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', comment: { author: string; content: string }): void
}>()

const isSubmitting = ref(false)
const form = ref<HTMLFormElement | null>(null)

const formData = reactive({
  author: '',
  content: ''
})

const errors = reactive({
  author: '',
  content: ''
})

const isFormValid = computed(() => {
  return formData.author.trim() !== '' && 
         formData.content.trim() !== '' && 
         !errors.author && 
         !errors.content
})

const validateField = (field: keyof typeof formData) => {
  const value = formData[field].trim()
  if (value === '') {
    errors[field] = 'This field is required'
  } else if (field === 'author' && value.length < 2) {
    errors[field] = 'Name must be at least 2 characters long'
  } else if (field === 'content' && value.length < 10) {
    errors[field] = 'Comment must be at least 10 characters long'
  } else {
    errors[field] = ''
  }
}

const resetForm = () => {
  formData.author = ''
  formData.content = ''
  errors.author = ''
  errors.content = ''
}

const handleSubmit = async () => {
  if (isSubmitting.value || !isFormValid.value) return

  isSubmitting.value = true
  try {
    emit('submit', { ...formData })
    resetForm()
    await new Promise(resolve => setTimeout(resolve, 100))
  } catch (error) {
    console.error('Error submitting comment:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-control:disabled {
  background-color: #e9ecef;
  opacity: 1;
}

.invalid-feedback {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style> 