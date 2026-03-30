<script setup lang="ts">
  import Technology from '../components/resume//technology/Technology.vue';
  import Projects from '../components/resume/Projects.vue';
  import Education from '../components/resume/Education.vue';
</script>

<template>
  <main class="main-layout">
    <Technology />
    <Projects />
    <Education />
  </main>
</template>

<style scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }
</style>
