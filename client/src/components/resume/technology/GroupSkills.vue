<script setup lang="ts">
  import type { Technology } from '../../../types/Technology.ts';

  const getLevelColor = (level: number | undefined) => {
    if (level == undefined) return '#e0e0e0'; // зеленый
    if (level >= 80) return '#7cff902e'; // зеленый
    if (level >= 50) return '#ffd97d47'; // оранжевый
    return '#ffc6c06b'; // красный
  };

  defineProps<{
    label: string;
    skills: Technology[];
  }>();
</script>

<template>
  <div class="skills-row">
    <span class="skills-label">{{ label }}</span>
    <div class="skills-items">
      <span
        v-for="skill in skills"
        :key="skill.name"
        class="skill-badge"
        :style="{
          background: `linear-gradient(90deg, ${getLevelColor(skill.level)} ${
            skill.level
          }%, white ${skill.level}%)`,
          borderColor: getLevelColor(skill.level)
        }"
      >
        {{ skill.name }}
      </span>
    </div>
  </div>
</template>

<style scoped>
  .skills-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.9rem;
  }

  .skills-label {
    text-align: start;
    min-width: 80px;
    font-weight: 600;
    color: #2c3e50;
  }

  .skills-items {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    flex: 1;
  }

  .skill-badge {
    color: #2c3e50;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    border: 1px solid;
    transition: all 0.2s ease;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-weight: 500;
  }

  .skill-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #2c3e50;
    background: white !important;
    border-color: #42b983 !important;
  }

  @media (max-width: 768px) {
    .skills-row {
      flex-direction: column;
      gap: 5px;
    }

    .skills-label {
      margin-left: 8px;
      min-width: auto;
    }
  }
</style>
