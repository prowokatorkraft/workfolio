<script setup lang="ts">
  import { useExperienceStore } from '../../stores/Experience.ts';
  import { EventEnum } from '../../types/Event-enum-type.ts';
  import Expand from '../icons/Expand.vue';
  import { useEventStore } from '../../stores/Event.ts';

  const experienceStore = useExperienceStore();
  const projects = experienceStore.projects;
  const events = useEventStore();
</script>

<template>
  <div class="projects-wrapper">
    <div class="experience-header">
      <h2 class="experience-title">
        <span>💼</span>
        <span class="experience-title-description">
          <span>Опыт работы</span>
          <span class="experience-label-right">{{ experienceStore.duration }}</span>
        </span>
      </h2>
    </div>

    <div class="projects-container">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-row"
        @mouseover="
          events.handleFocus(EventEnum.resume_projects_block_focus, project.id, 1000, 10000)
        "
        @mouseleave="events.handleBlur(EventEnum.resume_projects_block_focus, project.id)"
      >
        <div class="project-period-block">
          <span class="project-period">{{ experienceStore.getProjectPeriod(project.id) }}</span>
          <span class="project-duration">{{ experienceStore.getProjectDuration(project.id) }}</span>
        </div>

        <div class="project-content">
          <div class="project-header">
            <span class="project-title">{{ project.title }}</span>
            <span class="project-company">{{ project.company }}</span>
          </div>

          <p class="project-short-desc">
            {{ project.shortDescription }}
          </p>

          <button
            class="expand-button"
            :class="{ expanded: project.isExpanded }"
            @click="
              () => {
                experienceStore.toggleProject(project.id);
                if (project.isExpanded) {
                  events.handleClick(EventEnum.resume_projects_block_more_click, project.id);
                }
              }
            "
          >
            <span>{{ project.isExpanded ? 'Свернуть' : 'Подробнее' }}</span>
            <Expand :rotated="project.isExpanded" />
          </button>

          <div class="detailed-info" :class="{ expanded: project.isExpanded }">
            <div class="technologies-items">
              <span
                v-for="tech in experienceStore.getTechnologyByIds(project.technologyIds).value"
                :key="tech.id"
                class="skill-badge"
                :style="{
                  background: 'white',
                  borderColor: '#e0e0e0',
                  color: '#2c3e50'
                }"
              >
                {{ tech.name }}
              </span>
            </div>
            <p class="detailed-description">
              {{ project.detailedDescription }}
            </p>

            <div class="achievements">
              <span class="achievements-label">Достижения:</span>
              <div class="achievements-items">
                <div
                  v-for="achievement in project.achievements"
                  :key="achievement"
                  class="achievement-badge"
                  :style="{
                    background: 'white',
                    borderColor: '#e0e0e0',
                    color: '#2c3e50'
                  }"
                >
                  <span>✓</span>
                  {{ achievement }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .projects-wrapper {
    width: 100%;
  }

  .experience-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #42b983;
  }

  .experience-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .experience-label-right {
    font-weight: 500;
    color: #666;
    background: #f0f0f0;
    padding: 4px 7px;
    border-radius: 16px;
    font-size: 0.80rem;
    margin-left: 15px;
  }

  .projects-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .project-row {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    font-size: 0.9rem;
  }

  .project-period-block {
    min-width: 140px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 16px;
  }

  .project-period {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
    margin-left: 4px;
  }

  .project-duration {
    color: #999;
    font-size: 0.8rem;
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    width: fit-content;
  }

  .project-content {
    flex: 1;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 15px;
    transition: all 0.2s ease;
  }

  .project-content:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  .project-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .project-title {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
  }

  .project-company {
    color: #42b983;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .project-short-desc {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 10px 0;
    line-height: 1.4;
  }

  .technologies-items {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  /* Точная копия skill-badge из Skills */
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
    border-color: #e0e0e0;
    background: white;
  }

  .skill-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #2c3e50;
    background: white !important;
    border-color: #42b983 !important;
  }

  .expand-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid #e0e0e0;
    color: #666;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 5px;
  }

  .expand-button:hover {
    border-color: #42b983;
    color: #42b983;
  }

  .expand-button.expanded {
    background: #42b983;
    border-color: #42b983;
    color: white;
  }

  .detailed-info {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-top: 0;
  }

  .detailed-info.expanded {
    max-height: max-content;
    opacity: 1;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
  }

  .detailed-description {
    color: #2c3e50;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 15px 0;
  }

  .achievements-label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  .achievements-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .achievement-badge {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 3px 10px;
    border-radius: 16px;
    font-size: 0.8rem;
    border: 1px solid;
    transition: all 0.2s ease;
    border-color: #e0e0e0;
    background: white;
    color: #2c3e50;
  }

  .achievement-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #42b983 !important;
    background: white !important;
    color: #2c3e50;
  }

  @media (max-width: 768px) {
    .project-row {
      flex-direction: column;
      gap: 8px;
    }
    .project-period-block {
      min-width: auto;
      width: fit-content;
      flex-direction: row;
      margin-left: 10px;
    }

    .project-content:hover {
      transform: none;
    }

    .project-header {
      flex-direction: column;
      gap: 4px;
    }
  }

  @media (max-width: 410px) {
    .experience-title-description {
      display: flex;
      flex-direction: column;
    }

    .experience-label-right {
      width: max-content;
      margin-top: 5px;
    }
  }
</style>
