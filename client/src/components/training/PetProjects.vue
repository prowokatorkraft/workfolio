<script setup lang="ts">
  import { useTrainingStore } from '../../stores/Training.ts';

  const educationStore = useTrainingStore();
</script>

<template>
  <div class="training-section">
    <div class="training-section-header">
      <h2 class="training-section-title">
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
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          />
        </svg>
      </a>
    </div>

    <div class="projects-grid">
      <div
        v-for="project in educationStore.petProjects"
        :id="'pet-project' + project.id"
        :key="project.id"
        class="project-card"
      >
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
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
              />
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
</template>

<style scoped>
  .training-section {
    margin-bottom: 40px;
  }

  .training-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid #42b983;
  }

  .training-section-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

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

  .more-btn:hover .more-arrow {
    transform: translateX(3px);
  }

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

  @media (max-width: 768px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 410px) {
    .more-btn {
      margin-left: 0;
    }
  }
</style>
