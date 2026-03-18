<script setup lang="ts">
  import { useEducationStore } from '../stores/Education';

  const educationStore = useEducationStore();
</script>

<template>
  <div class="education-wrapper">
    <!-- Сертификаты и курсы -->
    <div class="education-section">
      <div class="education-section-header">
        <h2 class="education-section-title">
          <span>📜</span>
          <span>Сертификаты и курсы</span>
        </h2>
        <RouterLink to="/certificates" class="more-btn">
          <span>Все сертификаты</span>
          <span class="more-arrow">→</span>
        </RouterLink>
      </div>

      <div class="certificates-container">
        <div v-for="cert in educationStore.certificates" :key="cert.id" class="certificate-card">
          <div class="certificate-icon">
            <span>{{ cert.icon }}</span>
          </div>
          <div class="certificate-content">
            <div class="certificate-header">
              <span class="certificate-name">{{ cert.name }}</span>
              <span class="certificate-issuer">{{ cert.issuer }}</span>
            </div>
            <div class="certificate-meta">
              <span class="certificate-date">{{ cert.date }}</span>
              <span v-if="cert.hours" class="certificate-hours">{{ cert.hours }} часов</span>
            </div>
            <div v-if="cert.credentialId" class="certificate-credential">
              Credential ID: {{ cert.credentialId }}
            </div>
            <div class="certificate-skills">
              <span v-for="skill in cert.skills" :key="skill" class="skill-badge">
                {{ skill }}
              </span>
            </div>
            <a :href="cert.link" target="_blank" class="certificate-link">
              Посмотреть сертификат
              <svg class="arrow-icon" width="14" height="14" viewBox="0 0 14 14">
                <path
                  d="M3.5 5.25L7 8.75L10.5 5.25"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Пет-проекты -->
    <div class="education-section">
      <div class="education-section-header">
        <h2 class="education-section-title">
          <span>🚀</span>
          <span>Pet-проекты</span>
        </h2>
        <a :href="educationStore.githubUrl" target="_blank" class="more-btn">
          <span>GitHub</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      </div>

      <div class="projects-grid">
        <div v-for="project in educationStore.petProjects" :key="project.id" class="project-card">
          <div class="project-card-header">
            <h3 class="project-name">
              {{ project.name }}
            </h3>
            <span class="project-year">{{ project.year }}</span>
          </div>

          <p class="project-description">
            {{ project.description }}
          </p>

          <div class="project-tech">
            <span v-for="tech in project.techStack" :key="tech" class="skill-badge">
              {{ tech }}
            </span>
          </div>

          <div v-if="project.features" class="project-features">
            <span class="features-label">Ключевые особенности:</span>
            <ul class="features-list">
              <li v-for="feature in project.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="project-links">
            <a :href="project.repo" target="_blank" class="project-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              Репозиторий
            </a>
            <a v-if="project.demo" :href="project.demo" target="_blank" class="project-link demo">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Демо
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Формальное образование -->
    <div class="education-section">
      <div class="education-section-header">
        <h2 class="education-section-title">
          <span>🏛️</span>
          <span>Формальное образование</span>
        </h2>
      </div>

      <div class="education-container">
        <div v-for="edu in educationStore.formalEducation" :key="edu.id" class="education-row">
          <div class="education-period-block">
            <span class="education-period">{{ edu.period }}</span>
            <span class="education-status">{{ edu.status }}</span>
          </div>

          <div class="education-content">
            <div class="education-header">
              <span class="education-degree">{{ edu.degree }}</span>
              <span class="education-institution">{{ edu.institution }}</span>
            </div>

            <p class="education-description">
              {{ edu.description }}
            </p>

            <div class="education-details">
              <div v-if="edu.specialization" class="detail-item">
                <span class="detail-label">Специализация:</span>
                <span class="detail-value">{{ edu.specialization }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .education-wrapper {
    width: 100%;
  }

  /* Заголовок страницы */
  .education-page-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid #42b983;
  }

  .education-page-title {
    font-size: 2rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
  }

  .education-page-title-description {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }

  .education-page-label-right {
    font-weight: 500;
    color: #666;
    background: #f0f0f0;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.9rem;
  }

  /* Секции */
  .education-section {
    margin-bottom: 40px;
  }

  .education-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid #42b983;
  }

  .education-section-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  /* Кнопка "Подробнее" */
  .more-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid #e0e0e0;
    color: #666;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .more-btn:hover {
    border-color: #42b983;
    color: #42b983;
    background: #e8f5e9;
  }

  .more-arrow {
    transition: transform 0.2s ease;
  }

  .more-btn:hover .more-arrow {
    transform: translateX(3px);
  }

  .education-container {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .education-row {
    display: flex;
    align-items: flex-start;
    font-size: 0.9rem;
    flex-direction: column;
    gap: 8px;
  }

  .education-period-block {
    display: flex;
    gap: 4px;
    padding-top: 16px;
    flex-direction: row;
    width: fit-content;
    min-width: auto;
    margin-left: 15px;
  }

  .education-period {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
    margin-left: 4px;
  }

  .education-status {
    color: #999;
    font-size: 0.8rem;
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    width: fit-content;
  }

  .education-content {
    flex: 1;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s ease;
    width: -webkit-fill-available;
  }

  .education-content:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  .education-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .education-degree {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .education-institution {
    color: #42b983;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .education-description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 15px 0;
  }

  .education-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px dashed #e0e0e0;
  }

  .detail-item {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
  }

  .detail-label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.85rem;
  }

  .detail-value {
    color: #666;
    font-size: 0.85rem;
  }

  /* Сертификаты */
  .certificates-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .certificate-card {
    display: flex;
    gap: 15px;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s ease;
    border: 1px solid #e0e0e0;
  }

  .certificate-card:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    border-color: #42b983;
  }

  .certificate-icon {
    font-size: 1.5rem;
    min-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
  }

  .certificate-content {
    flex: 1;
  }

  .certificate-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 5px;
    flex-wrap: wrap;
  }

  .certificate-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
  }

  .certificate-issuer {
    color: #42b983;
    font-size: 0.9rem;
  }

  .certificate-meta {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
    font-size: 0.8rem;
    color: #999;
  }

  .certificate-credential {
    color: #999;
    font-size: 0.8rem;
    margin-bottom: 10px;
    padding: 2px 0;
  }

  .certificate-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .certificate-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #42b983;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .certificate-link:hover {
    gap: 10px;
    color: #2c3e50;
  }

  /* Pet-проекты */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .project-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.2s ease;
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: #42b983;
  }

  .project-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .project-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .project-year {
    color: #999;
    font-size: 0.8rem;
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 12px;
  }

  .project-description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 15px 0;
  }

  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 15px;
  }

  .project-features {
    margin-bottom: 15px;
  }

  .features-label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.85rem;
    margin-bottom: 8px;
  }

  .features-list {
    margin: 0;
    padding-left: 20px;
    color: #666;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .features-list li {
    margin-bottom: 4px;
  }

  .project-links {
    display: flex;
    gap: 15px;
    margin-top: auto;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
  }

  .project-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #666;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .project-link:hover {
    color: #42b983;
    gap: 8px;
  }

  .project-link.demo {
    color: #42b983;
  }

  .project-link.demo:hover {
    color: #2c3e50;
  }

  /* Языки */
  .languages-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
  }

  .language-item {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .language-name {
    min-width: 100px;
    font-weight: 600;
    color: #2c3e50;
  }

  .language-level {
    min-width: 100px;
    color: #666;
    font-size: 0.9rem;
  }

  .language-progress {
    flex: 1;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #42b983, #2c3e50);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  /* Skill badge (как в Projects.vue) */
  .skill-badge {
    color: #2c3e50;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
    background: white;
    font-weight: 500;
  }

  .skill-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #42b983 !important;
  }

  /* Arrow icon */
  .arrow-icon {
    transition: transform 0.2s ease;
  }

  .certificate-link:hover .arrow-icon {
    transform: translateX(3px);
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .education-page-title {
      font-size: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .education-page-title-description {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .education-row {
      flex-direction: column;
      gap: 8px;
    }

    .education-period-block {
      min-width: auto;
      width: fit-content;
      flex-direction: row;
    }

    .education-content:hover {
      transform: none;
    }

    .education-header {
      flex-direction: column;
      gap: 4px;
    }

    .certificate-card {
      flex-direction: column;
    }

    .certificate-icon {
      width: fit-content;
    }

    .projects-grid {
      grid-template-columns: 1fr;
    }

    .language-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .language-name,
    .language-level {
      min-width: auto;
    }

    .language-progress {
      width: 100%;
    }
  }

  @media (max-width: 410px) {
    .education-section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .education-period-block {
      flex-direction: column;
    }

    .more-btn {
      margin-left: 0;
    }
  }
</style>
