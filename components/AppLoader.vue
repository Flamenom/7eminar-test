<template>
  <div class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-3 text-muted">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'Loading...'
})
</script> 