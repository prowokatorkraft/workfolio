<script setup lang="ts">
  import { useTrainingStore } from '../../stores/Training.ts';
  import { useEvents } from '../../composables/useEvents.ts';
  import { EventEnum } from '../../types/Event-enum-type.ts';

  const educationStore = useTrainingStore();
  const events = useEvents();
</script>

<template>
  <div class="training-section">
    <div id="education" class="training-section-header">
      <h2 class="training-section-title">
        <span>🏛️</span>
        <span>Образование</span>
      </h2>
    </div>

    <div class="education-container">
      <div
        v-for="edu in educationStore.formalEducation"
        :key="edu.id"
        class="education-row"
        @mouseover="events.handleFocus(EventEnum.training_education_block_focus, edu.id)"
        @mouseleave="events.handleBlur(EventEnum.training_education_block_focus, edu.id)"
      >
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

          <div v-if="edu.specialization" class="education-details">
            <div class="detail-item">
              <span class="detail-label">Специализация:</span>
              <span class="detail-value">{{ edu.specialization }}</span>
            </div>
          </div>
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

  @media (max-width: 768px) {
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
  }

  @media (max-width: 410px) {
    .training-section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .education-period-block {
      flex-direction: column;
    }
  }
</style>
