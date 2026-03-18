<script setup lang="ts">
  import { useAboutStore } from '../stores/About.ts';
  import { storeToRefs } from 'pinia';

  const aboutStore = useAboutStore();
  const { personalInfo, contacts, hobbies, languages, stats } = storeToRefs(aboutStore);
</script>

<template>
  <div class="about-wrapper">
    <!-- Заголовок страницы -->
    <div class="about-page-header">
      <h1 class="about-page-title">
        <span>👤</span>
        <span class="about-page-title-description">
          <span>Обо мне</span>
          <span class="about-page-label-right">{{ stats.yearsExperience }} лет в разработке</span>
        </span>
      </h1>
    </div>

    <!-- Основной контент -->
    <div class="about-container">
      <!-- Левая колонка с фото -->
      <div class="about-left-column">
        <div class="photo-card">
          <div class="photo-frame">
            <img :src="personalInfo.photo" :alt="personalInfo.name" class="profile-photo" />
          </div>
          <h2 class="photo-name">{{ personalInfo.name }}</h2>
          <p class="photo-title">{{ personalInfo.title }}</p>

          <div class="photo-stats">
            <div class="stat-item">
              <span class="stat-value">{{ stats.age }}</span>
              <span class="stat-label">лет</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.projects }}</span>
              <span class="stat-label">проектов</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.certificates }}</span>
              <span class="stat-label">сертификатов</span>
            </div>
          </div>

          <div class="photo-contacts">
            <div v-for="contact in contacts" :key="contact.type" class="contact-item">
              <span class="contact-icon">{{ contact.icon }}</span>
              <div class="contact-info">
                <span class="contact-label">{{ contact.label }}:</span>
                <a v-if="contact.link" :href="contact.link" target="_blank" class="contact-value">
                  {{ contact.value }}
                </a>
                <span v-else class="contact-value">{{ contact.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка с информацией -->
      <div class="about-right-column">
        <!-- Краткая информация -->
        <div class="info-section">
          <div class="info-section-header">
            <h2 class="info-section-title">
              <span>📋</span>
              <span>Краткая информация</span>
            </h2>
          </div>

          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Полное имя:</span>
              <span class="info-value">{{ personalInfo.fullName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Возраст:</span>
              <span class="info-value"
                >{{ personalInfo.age }} лет ({{ personalInfo.birthDate }})</span
              >
            </div>
            <div class="info-row">
              <span class="info-label">Семейное положение:</span>
              <span class="info-value">{{ personalInfo.maritalStatus }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Город:</span>
              <span class="info-value">{{ personalInfo.city }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Гражданство:</span>
              <span class="info-value">{{ personalInfo.citizenship }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Готов к переезду:</span>
              <span class="info-value">{{ personalInfo.relocation }}</span>
            </div>
          </div>
        </div>

        <!-- О себе -->
        <div class="info-section">
          <div class="info-section-header">
            <h2 class="info-section-title">
              <span>💭</span>
              <span>О себе</span>
            </h2>
          </div>

          <div class="about-text">
            <p
              v-for="(paragraph, index) in personalInfo.about"
              :key="index"
              class="about-paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>

        <!-- Хобби и интересы -->
        <div class="info-section">
          <div class="info-section-header">
            <h2 class="info-section-title">
              <span>🎯</span>
              <span>Хобби и интересы</span>
            </h2>
          </div>

          <div class="hobbies-container">
            <div v-for="hobby in hobbies" :key="hobby.name" class="hobby-item">
              <span class="hobby-icon">{{ hobby.icon }}</span>
              <span class="hobby-name">{{ hobby.name }}</span>
            </div>
          </div>
        </div>

        <!-- Языки -->
        <div class="info-section">
          <div class="info-section-header">
            <h2 class="info-section-title">
              <span>🗣️</span>
              <span>Языки</span>
            </h2>
          </div>

          <div class="languages-container">
            <div v-for="lang in languages" :key="lang.name" class="language-item">
              <span class="language-name">{{ lang.name }}</span>
              <span class="language-level">{{ lang.level }}</span>
              <div class="language-progress">
                <div class="progress-bar" :style="{ width: lang.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Личные качества -->
        <div class="info-section">
          <div class="info-section-header">
            <h2 class="info-section-title">
              <span>⭐</span>
              <span>Личные качества</span>
            </h2>
          </div>

          <div class="qualities-container">
            <span v-for="quality in personalInfo.qualities" :key="quality" class="quality-badge">
              {{ quality }}
            </span>
          </div>
        </div>

        <!-- Социальные сети -->
        <div class="info-section">
          <div class="info-section-header">
            <h2 class="info-section-title">
              <span>🌐</span>
              <span>Социальные сети</span>
            </h2>
          </div>

          <div class="social-container">
            <a
              v-for="social in contacts.filter((c) => c.social)"
              :key="social.type"
              :href="social.link"
              target="_blank"
              class="social-link"
            >
              <span class="social-icon">{{ social.icon }}</span>
              <span class="social-name">{{ social.label }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .about-wrapper {
    width: 100%;
  }

  /* Заголовок страницы */
  .about-page-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid #42b983;
  }

  .about-page-title {
    font-size: 2rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
  }

  .about-page-title-description {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }

  .about-page-label-right {
    font-weight: 500;
    color: #666;
    background: #f0f0f0;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.9rem;
  }

  /* Основной контейнер */
  .about-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 30px;
  }

  /* Левая колонка */
  .about-left-column {
    position: sticky;
    top: 20px;
    align-self: start;
  }

  .photo-card {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 25px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
  }

  .photo-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: #42b983;
  }

  .photo-frame {
    width: 180px;
    height: 180px;
    margin: 0 auto 20px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #42b983;
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
  }

  .profile-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .profile-photo:hover {
    transform: scale(1.05);
  }

  .photo-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    text-align: center;
    margin: 0 0 5px;
  }

  .photo-title {
    color: #42b983;
    text-align: center;
    font-size: 0.95rem;
    margin: 0 0 20px;
  }

  .photo-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 25px;
    padding: 15px 0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #999;
  }

  .photo-contacts {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: white;
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  .contact-item:hover {
    background: #e8f5e9;
    transform: translateX(5px);
  }

  .contact-icon {
    font-size: 1.2rem;
    min-width: 24px;
  }

  .contact-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .contact-label {
    font-size: 0.7rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .contact-value {
    font-size: 0.9rem;
    color: #2c3e50;
    text-decoration: none;
    font-weight: 500;
  }

  .contact-value:hover {
    color: #42b983;
  }

  /* Правая колонка */
  .about-right-column {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .info-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
  }

  .info-section:hover {
    border-color: #42b983;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .info-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
  }

  .info-section-title {
    font-size: 1.2rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  /* Информационная сетка */
  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .info-row {
    display: flex;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px dashed #e0e0e0;
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-label {
    min-width: 150px;
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
  }

  .info-value {
    color: #2c3e50;
    font-size: 0.95rem;
  }

  /* Текст о себе */
  .about-text {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .about-paragraph {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
  }

  /* Хобби */
  .hobbies-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  .hobby-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: white;
    border-radius: 30px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
  }

  .hobby-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #42b983;
  }

  .hobby-icon {
    font-size: 1.1rem;
  }

  .hobby-name {
    color: #2c3e50;
    font-size: 0.9rem;
    font-weight: 500;
  }

  /* Языки */
  .languages-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
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
    min-width: 120px;
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

  /* Личные качества */
  .qualities-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .quality-badge {
    padding: 6px 14px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    color: #2c3e50;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .quality-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #42b983;
    background: #e8f5e9;
  }

  /* Социальные сети */
  .social-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 30px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .social-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #42b983;
  }

  .social-icon {
    font-size: 1.2rem;
  }

  .social-name {
    color: #2c3e50;
    font-size: 0.9rem;
    font-weight: 500;
  }

  /* Адаптивность */
  @media (max-width: 1024px) {
    .about-container {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .about-left-column {
      position: static;
      max-width: 400px;
      margin: 0 auto;
    }

    .photo-card {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .about-page-title {
      font-size: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .about-page-title-description {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .info-row {
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      min-width: auto;
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

    .hobbies-container,
    .social-container {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .photo-stats {
      flex-direction: column;
      gap: 15px;
    }

    .contact-item {
      flex-direction: column;
      text-align: center;
    }

    .contact-info {
      align-items: center;
    }
  }
</style>
