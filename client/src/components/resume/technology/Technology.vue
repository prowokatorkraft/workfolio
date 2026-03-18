<script setup lang="ts">
  import GroupSkills from './GroupSkills.vue';
  import { TechnologyGroup } from '../../../types/Technology.ts';
  import { useExperienceStore } from '../../../stores/Experience.ts';
  import { computed } from 'vue';
  
  const expStore = useExperienceStore();
  const backendSkills = computed(
    () => expStore.getTechnologyByGroup(TechnologyGroup.backend).value
  );
  const frontendSkills = computed(
    () => expStore.getTechnologyByGroup(TechnologyGroup.frontend).value
  );
  const dataSkills = computed(() => expStore.getTechnologyByGroup(TechnologyGroup.data).value);
  const toolsSkills = computed(() => expStore.getTechnologyByGroup(TechnologyGroup.none).value);
</script>

<template>
  <div class="technology-container">
    <div class="technology-header">
      <h2 class="technology-title">
        <span class="title-icon">⚙️</span>
        Стек технологий
      </h2>
    </div>

    <div class="technology-minimal">
      <GroupSkills label="Backend" :skills="backendSkills" />
      <GroupSkills label="Frontend" :skills="frontendSkills" />
      <GroupSkills label="Data" :skills="dataSkills" />
      <GroupSkills label="Tools" :skills="toolsSkills" />
    </div>
  </div>
</template>

<style scoped>
  .technology-container {
    width: 100%;
  }

  .technology-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #42b983;
  }

  .technology-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .title-icon {
    font-size: 1.5rem;
  }

  .technology-minimal {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .technology-title {
      font-size: 1.3rem;
    }
  }
</style>
