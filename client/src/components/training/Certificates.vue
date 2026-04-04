<script setup lang="ts">
  import { useTrainingStore } from '../../stores/Training.ts';
  import ImageModal from '../ImageModal.vue';
  import { ref } from 'vue';
  import Link from '../Link.vue';
  import RouteLink from '../RouteLink.vue';
  import GitHubIcon from '../icons/GitHubIcon.vue';
  import LinkIcon from '../icons/LinkIcon.vue';
  import { EventEnum } from '../../types/Event-enum-type.ts';
  import { useEventStore } from '../../stores/Event.ts';
  const educationStore = useTrainingStore();
  const openImage = ref<(imageUrl: string) => void>(() => {});
  const events = useEventStore();

  const handleOpenImage = (value: (imageUrl: string) => void) => {
    openImage.value = value;
  };
  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.src = '/certificates/placeholder.svg';
  };
</script>

<template>
  <div class="training-section">
    <div class="training-section-header">
      <h2 class="training-section-title">
        <span>📜</span>
        <span>Сертификаты</span>
      </h2>
    </div>
    <div class="certificates-container">
      <div
        v-for="cert in educationStore.certificates"
        :key="cert.id"
        class="certificate-card"
        @mouseover="
          events.handleFocus(EventEnum.training_certificates_block_focus, cert.id, 1000, 10000)
        "
        @mouseleave="events.handleBlur(EventEnum.training_certificates_block_focus, cert.id)"
      >
        <img
          :src="`/certificates/` + cert.icon"
          :alt="cert.name"
          class="certificate-icon"
          @error="handleImageError"
          @click="
            () => {
              openImage(`/certificates/` + cert.icon);
              events.handleClick(EventEnum.training_certificates_image_click, cert.id);
            }
          "
        />
        <div class="certificate-content">
          <div class="certificate-header">
            <Link
              :value="cert.courseLink"
              class="certificate-name"
              @click="events.handleClick(EventEnum.training_certificates_course_click, cert.id)"
            >
              {{ cert.name }}
            </Link>
            <span class="certificate-issuer">{{ cert.issuer }}</span>
          </div>
          <div class="certificate-meta">
            <div v-if="cert.credentialId" class="certificate-credential">
              <Link
                :value="cert.credentialLink"
                class="certificate-credential"
                @click="events.handleClick(EventEnum.training_certificates_id_click, cert.id)"
              >
                {{ cert.credentialId }}
              </Link>
            </div>
            <span v-if="cert.hours" class="certificate-hours">{{ cert.hours }} часов</span>
            <span class="certificate-date">{{ cert.date }}</span>
          </div>
          <div class="certificate-link">
            <Link
              v-if="cert.repo"
              :value="cert.repo"
              class="project-link"
              @click="events.handleClick(EventEnum.training_certificates_repo_click, cert.id)"
            >
              <GitHubIcon />
              Репозиторий
            </Link>
            <RouteLink
              v-if="cert.petProjectId"
              :to="`/training#pet-project` + cert.petProjectId"
              @click="events.handleClick(EventEnum.training_certificates_project_link, cert.id)"
            >
              <LinkIcon />
              Курсовая работа
            </RouteLink>
          </div>
          <div class="certificate-skills">
            <span v-for="skill in cert.skills" :key="skill" class="skill-badge">
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ImageModal @open-handler="handleOpenImage" />
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
    min-width: 80px;
    max-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
    flex-shrink: 0;
    height: fit-content;
    max-height: 135px;
    object-fit: cover;
  }

  .certificate-icon:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
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
  }

  .certificate-link {
    color: #999;
    font-size: 0.8rem;
    gap: 15px;
    font-weight: 500;
    margin-bottom: 15px;
    flex-flow: row;
    display: flex;
  }

  .certificate-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .skill-badge {
    color: #2c3e50;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .skill-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #42b983 !important;
  }

  @media (max-width: 768px) {
    .certificate-card {
      flex-direction: column;
    }

    .certificate-icon {
      width: fit-content;
      max-width: 80%;
      max-height: 500px;
    }
  }

  @media (max-width: 410px) {
    .training-section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
  }

  @media (max-width: 380px) {
    .certificate-link {
      flex-flow: column;
      gap: 5px;
    }
  }
</style>
