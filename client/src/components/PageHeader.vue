<script setup lang="ts">
  // Здесь будет логика компонента
</script>

<template>
  <header class="header">
    <nav class="nav">
      <RouterLink
        to="/"
        class="nav-link"
      >
        Резюме
      </RouterLink>
      <RouterLink
        to="/education"
        class="nav-link"
      >
        Образование
      </RouterLink>
      <RouterLink
        to="/analytics"
        class="nav-link"
      >
        Аналитика
      </RouterLink>
      <RouterLink
        to="/about"
        class="nav-link"
      >
        Обо мне
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
  /* Сброс стилей */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Шапка */
  .header {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 15px 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    gap: 30px;
    padding: 0 20px;
  }

  .nav-link {
    color: #2c3e50;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
    position: relative;
  }

  .nav-link:hover {
    color: #42b983;
    background: rgba(66, 185, 131, 0.1);
  }

  .nav-link.router-link-active {
    color: #42b983;
    font-weight: 600;
  }

  .nav-link.router-link-active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    background: #42b983;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    .nav {
      flex-wrap: wrap;
      gap: 10px;
    }

    .nav-link {
      font-size: 0.9rem;
      padding: 6px 12px;
    }
  }

  :global(.router-link-active) {
    color: #42b983;
    font-weight: 600;
  }
</style>
