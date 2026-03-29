<script setup lang="ts">
  import Technology from '../components/resume//technology/Technology.vue';
  import Projects from '../components/resume/Projects.vue';
  import Education from '../components/resume/Education.vue';
  import { useEvents } from '../composables/useEvents.ts';
  import { onMounted } from 'vue';
  import { EventEnum } from '../types/Event-enum-type.ts';

  const events = useEvents();
  onMounted(() => {
    events.handleClick(EventEnum.open, 'resume');
  });
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
