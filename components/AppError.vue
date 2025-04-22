<template>
  <div class="text-center py-5">
    <div class="error-state">
      <i class="bi bi-exclamation-circle display-1 mb-3"></i>
      <h2>{{ title }}</h2>
      <p class="text-muted mb-4">{{ message }}</p>
      <slot>
        <button class="btn btn-primary" @click="$emit('retry')">
          Try again
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message: string
}>(), {
  title: 'An error occurred'
})

defineEmits<{
  (e: 'retry'): void
}>()
</script>

<style scoped>
.error-state {
  color: #dc3545;
  opacity: 0.7;
}
</style> 