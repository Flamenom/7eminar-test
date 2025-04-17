<template>
  <div>
    <!-- Навигация -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <NuxtLink class="navbar-brand" to="/">
          Новостное приложение
        </NuxtLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <NuxtLink class="nav-link" to="/" active-class="active">
                Главная
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Основной контент -->
    <main>
      <slot />
    </main>

    <!-- Футер -->
    <footer class="bg-light py-4 mt-4">
      <div class="container">
        <div class="text-center text-muted">
          © {{ new Date().getFullYear() }} Новостное приложение
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Инициализация Bootstrap JavaScript
onMounted(() => {
  // В реальном приложении здесь можно добавить инициализацию
  // компонентов Bootstrap, требующих JavaScript
})
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