<script setup lang="ts">
  import GroupSkills from './GroupSkills.vue';
  import { TechnologyGroup, type TechnologyGroupType } from '../../../types/Technology.ts';
  import { useExperienceStore } from '../../../stores/Experience.ts';

  const expStore = useExperienceStore();
  const getTechnologyByGroup = (group: TechnologyGroupType) => {
    const items = expStore.getTechnologyByGroup(group).value.sort((a, b) => {
      const levelA = a.level ?? -1;
      const levelB = b.level ?? -1;
      return levelB - levelA;
    });
    return [...items];
  };
</script>

<template>
  <div class="technology-container">
    <div class="technology-header">
      <h2 class="technology-title">
        <span class="title-icon">⚙️</span>
        Стек технологий и уровень взаимодействия
      </h2>
    </div>

    <div class="technology-minimal">
      <GroupSkills label="Backend" :skills="getTechnologyByGroup(TechnologyGroup.backend)" />
      <GroupSkills label="Frontend" :skills="getTechnologyByGroup(TechnologyGroup.frontend)" />
      <GroupSkills label="Data" :skills="getTechnologyByGroup(TechnologyGroup.data)" />
      <GroupSkills label="Tools" :skills="getTechnologyByGroup(TechnologyGroup.none)" />
      <GroupSkills
        label="Architecture"
        :skills="getTechnologyByGroup(TechnologyGroup.architecture)"
      />
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
    .technology-minimal {
      gap: 15px;
    }
    .technology-title {
      font-size: 1.3rem;
    }
  }
</style>
