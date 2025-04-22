<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <NuxtLink class="navbar-brand" to="/">
          News App
        </NuxtLink>
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleMenu"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" :class="{ show: isMenuOpen }" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/" active-class="active">
                Home
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>

    <footer class="bg-light py-4 mt-4">
      <div class="container">
        <div class="text-center text-muted">
          © {{ new Date().getFullYear() }} News App
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style>
/* Глобальные стили */
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

footer {
  margin-top: auto;
}
</style> 