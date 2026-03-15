<script setup lang="ts">
  import TechStack from '../components/resume/teck-stack/TechStack.vue';
  import Experience from '../components/resume/Experience.vue';
  import Education from '../components/resume/Education.vue';
</script>

<template>
  <main class="main-layout">
    <TechStack />
    <Experience />
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
