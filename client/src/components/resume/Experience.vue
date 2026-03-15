<script setup lang="ts">
  import { ref } from 'vue';
  import type { WorkProject } from '../../types/WorkProject.ts';

  const projects = ref<WorkProject[]>([
    {
      id: 1,
      period: '2023 — наст. время',
      duration: '2 года 3 мес.',
      title: 'CRM система',
      company: 'ООО "ТехноПрогресс"',
      shortDescription: 'Разработка внутренней CRM системы для управления клиентами',
      detailedDescription:
        'Полная переработка существующей CRM системы. Реализована система авторизации, дашборды с графиками, управление задачами в реальном времени, интеграция с внешними API. Оптимизация производительности увеличила скорость загрузки на 40%.',
      technologies: ['Vue 3', 'TypeScript', 'Pinia', 'WebSocket', 'Tailwind'],
      achievements: [
        'Увеличил производительность на 40%',
        'Внедрил 5 новых модулей',
        'Сократил время загрузки'
      ],
      isExpanded: false
    },
    {
      id: 2,
      period: '2022 — 2023',
      duration: '1 год 2 мес.',
      title: 'Мобильное приложение',
      company: 'FoodDelivery Inc',
      shortDescription: 'Разработка приложения для доставки еды',
      detailedDescription:
        'Создание кроссплатформенного приложения. Реализован функционал отслеживания заказов, интеграция с картами, система оплаты, push-уведомления. Приложение обслуживает более 10 000 пользователей ежемесячно.',
      technologies: ['React Native', 'Redux', 'Firebase', 'Google Maps'],
      achievements: [
        '10 000+ активных пользователей',
        'Интеграция с 3 платежными системами',
        '4.8★ в сторах'
      ],
      isExpanded: false
    },
    {
      id: 3,
      period: '2021 — 2022',
      duration: '1 год 0 мес.',
      title: 'Платформа обучения',
      company: 'EduTech Solutions',
      shortDescription: 'Создание платформы для онлайн-обучения',
      detailedDescription:
        'Разработка образовательной платформы с видео-плеером, системой комментариев, личным кабинетом студента и админ-панелью для преподавателей.',
      technologies: ['Next.js', 'React', 'Node.js', 'MongoDB'],
      achievements: [
        '500+ часов видео контента',
        '3000+ зарегистрированных студентов',
        '50+ курсов'
      ],
      isExpanded: false
    }
  ]);

  const toggleProject = (id: number) => {
    const project = projects.value.find((p) => p.id === id);
    if (project) {
      project.isExpanded = !project.isExpanded;
    }
  };

  const totalExperience = '5 лет 5 мес.';
</script>

<template>
  <div class="experience-wrapper">
    <div class="experience-header">
      <h2 class="experience-title">
        <span>💼 Опыт работы</span>
        <span class="experience-label-right">{{ totalExperience }}</span>
      </h2>
    </div>

    <div class="projects-container">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-row"
      >
        <div class="project-period-block">
          <span class="project-period">{{ project.period }}</span>
          <span class="project-duration">{{ project.duration }}</span>
        </div>

        <div class="project-content">
          <div class="project-header">
            <span class="project-title">{{ project.title }}</span>
            <span class="project-company">{{ project.company }}</span>
          </div>

          <p class="project-short-desc">{{ project.shortDescription }}</p>

          <div class="technologies-items">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="skill-badge"
              :style="{
                background: 'white',
                borderColor: '#e0e0e0',
                color: '#2c3e50'
              }"
            >
              {{ tech }}
            </span>
          </div>

          <button
            class="expand-button"
            :class="{ expanded: project.isExpanded }"
            @click="toggleProject(project.id)"
          >
            <span>{{ project.isExpanded ? 'Свернуть' : 'Подробнее' }}</span>
            <svg
              class="arrow-icon"
              :class="{ rotated: project.isExpanded }"
              width="14"
              height="14"
              viewBox="0 0 14 14"
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div
            class="detailed-info"
            :class="{ expanded: project.isExpanded }"
          >
            <p class="detailed-description">
              {{ project.detailedDescription }}
            </p>

            <div class="achievements">
              <span class="achievements-label">Достижения:</span>
              <div class="achievements-items">
                <span
                  v-for="achievement in project.achievements"
                  :key="achievement"
                  class="achievement-badge"
                  :style="{
                    background: 'white',
                    borderColor: '#e0e0e0',
                    color: '#2c3e50'
                  }"
                >
                  ✓ {{ achievement }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .experience-wrapper {
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

  .skills-label {
    text-align: start;
    min-width: 120px;
    font-weight: 600;
    color: #2c3e50;
  }

  .experience-label-right {
    font-weight: 500;
    color: #666;
    background: #f0f0f0;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.85rem;
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

  .arrow-icon {
    transition: transform 0.2s ease;
  }

  .arrow-icon.rotated {
    transform: rotate(180deg);
  }

  .detailed-info {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-top: 0;
  }

  .detailed-info.expanded {
    max-height: 300px;
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
    }

    .project-content:hover {
      transform: none;
    }

    .project-header {
      flex-direction: column;
      gap: 4px;
    }

    .detailed-info.expanded {
      max-height: 400px;
    }
  }
</style>
