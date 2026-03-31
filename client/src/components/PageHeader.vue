<script setup lang="ts">
  defineProps<{
    currentRoute: string;
  }>();
</script>

<template>
  <header class="header">
    <nav class="nav">
      <RouterLink
        to="/"
        :class="currentRoute === 'Resume' ? 'nav-link nav-link-current' : 'nav-link'"
      >
        Резюме
      </RouterLink>
      <RouterLink
        to="/training"
        class="nav-link"
        :class="currentRoute === 'Training' ? 'nav-link nav-link-current' : 'nav-link'"
      >
        Обучение
      </RouterLink>
      <RouterLink
        to="/analytics"
        :class="currentRoute === 'Analytics' ? 'nav-link nav-link-current' : 'nav-link'"
      >
        Аналитика
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .header {
    border-radius: 0 0 20px 20px;
    background-color: rgba(255, 255, 255, 0.9);
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

  .nav-link-current {
    background: #eaebeba3;
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
</style>
