<script setup lang="ts">
  import { computed } from 'vue';
  import { useAnalyticsStore } from '../../stores/Analytics.ts';
  import { getEventIcon } from '../../types/Event-enum-type.ts';

  const analyticsStore = useAnalyticsStore();

  const totalEventsCount = computed(() => {
    if (!analyticsStore.eventGroups?.length) return 0;
    return analyticsStore.eventGroups.reduce((sum, group) => sum + Number(group.count), 0);
  });
</script>

<template>
  <div class="events-groups-wrapper">
    <div class="events-groups-header">
      <h3 class="events-groups-title">
        <span>📊</span>
        <span>Группы событий</span>
        <span v-if="analyticsStore.eventGroups?.length" class="events-groups-stats">
          <span class="stats-badge">Всего: {{ analyticsStore.eventGroups.length }}</span>
          <span class="stats-badge total-count">Событий: {{ totalEventsCount }}</span>
        </span>
        <span v-if="analyticsStore.eventGroupsLoading" class="loading-spinner">
          <span class="spinner" />
        </span>
      </h3>
    </div>

    <div v-if="!analyticsStore.eventGroups?.length" class="empty-container">
      <span class="empty-icon">📭</span>
      <span>Нет данных о группах событий</span>
    </div>

    <div v-else class="events-groups-container">
      <div v-for="group in analyticsStore.eventGroups" :key="group.id">
        <div class="event-group-content">
          <div class="event-group-icon">
            {{ getEventIcon(group.id) }}
          </div>
          <div class="event-group-info">
            <div class="event-group-header">
              <span class="event-group-id-badge">{{ group.id }}</span>
              <span class="event-group-name">{{ group.name }}</span>
              <span v-if="group.description" class="event-group-description">
                {{ group.description }}
              </span>
            </div>
          </div>
          <div class="event-group-stats">
            <span class="event-count-badge">{{ group.count }} событий</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .events-groups-wrapper {
    width: 100%;
  }

  .events-groups-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #42b983;
    flex-wrap: wrap;
  }

  .events-groups-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .events-groups-stats {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .stats-badge {
    font-weight: 500;
    color: #666;
    background: #f0f0f0;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.85rem;
  }

  .stats-badge.total-count {
    background: #e8f5e9;
    color: #42b983;
  }

  .loading-spinner {
    display: inline-flex;
    margin-left: 8px;
  }

  .spinner {
    width: 15px;
    height: 15px;
    border: 3px solid #f0f0f0;
    border-top-color: #42b983;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
    color: #999;
    background: #f8f9fa;
    border-radius: 12px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .events-groups-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .event-group-content {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 5px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;
  }

  .event-group-content:hover {
    background: #f0f2f5;
    transform: translateX(5px);
  }

  .event-group-icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    width: 30px;
    height: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .event-group-info {
    flex: 1;
  }

  .event-group-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }

  .event-group-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
  }

  .event-group-id-badge {
    background: #e0e0e0;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-family: monospace;
    color: #666;
  }

  .event-group-description {
    color: #888;
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .event-group-stats {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .event-count-badge {
    color: #42b983;
    font-size: 0.8rem;
    background: #e8f5e9;
    padding: 4px 12px;
    border-radius: 16px;
    font-weight: 500;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .event-group-stats {
      margin-left: auto;
    }

    .event-group-info {
      flex: 1 1 100%;
      order: 1;
    }

    .event-group-icon {
      order: 0;
    }

    .event-group-stats {
      order: 2;
    }
  }

  @media (max-width: 480px) {
    .events-groups-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .event-group-content {
      padding: 12px;
    }

    .event-group-icon {
      width: 40px;
      height: 40px;
      font-size: 24px;
    }

    .event-group-name {
      font-size: 0.9rem;
    }
  }
</style>
