<script setup lang="ts">
  import Certificates from '../components/training/Certificates.vue';
  import PetProjects from '../components/training/PetProjects.vue';
  import Education from '../components/training/Education.vue';
</script>

<template>
  <main class="training-wrapper">
    <Certificates />
    <PetProjects />
    <Education />
  </main>
</template>

<style scoped>
  .training-wrapper {
    width: 100%;
  }
</style>
