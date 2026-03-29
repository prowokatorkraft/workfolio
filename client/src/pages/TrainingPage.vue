<script setup lang="ts">
  import Certificates from '../components/training/Certificates.vue';
  import PetProjects from '../components/training/PetProjects.vue';
  import Education from '../components/training/Education.vue';
  import { useEvents } from '../composables/useEvents.ts';
  import { onMounted } from 'vue';
  import { EventEnum } from '../types/Event-enum-type.ts';

  const events = useEvents();
  onMounted(() => {
    events.handleClick(EventEnum.open, 'training');
  });
</script>

<template>
  <div class="training-wrapper">
    <Certificates />
    <PetProjects />
    <Education />
  </div>
</template>

<style scoped>
  .training-wrapper {
    width: 100%;
  }
</style>
