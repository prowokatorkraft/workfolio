<script setup lang="ts">
  import { getEventIcon } from '../../types/Event-enum-type.ts';
  import type { UserGroup } from '../../types/UserGroup.ts';

  defineProps<{
    group: UserGroup;
    isExpanded: (userId: string) => boolean;
  }>();
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
</script>

<template>
  <div class="detailed-info" :class="{ expanded: isExpanded(group.userId) }">
    <div class="events-list">
      <div v-for="event in group.events" :key="event.id" class="event-item">
        <div class="event-icon">
          {{ getEventIcon(event.eventId) }}
        </div>
        <div class="event-details">
          <div class="event-header">
            <div class="event-meta">
              <span class="event-id-badge">{{ event.eventId }}</span>
              <span class="event-name">{{ event.eventName || `Событие ${event.eventId}` }}</span>
              <span v-if="event.description" class="event-description">{{
                event.description
              }}</span>
            </div>
            <span class="event-time">{{ formatDate(event.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;
  }

  .events-list::-webkit-scrollbar {
    width: 6px;
  }

  .events-list::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }

  .events-list::-webkit-scrollbar-thumb {
    background: #42b983;
    border-radius: 3px;
  }

  .event-item {
    display: flex;
    gap: 12px;
    padding: 10px 12px;
    background: white;
    border-radius: 10px;
    border: 1px solid #e8e8e8;
    transition: all 0.2s ease;
    cursor: pointer;
    align-items: center;
  }

  .event-item:hover {
    border-color: #42b983;
    transform: translateX(3px);
    box-shadow: 0 2px 6px rgba(66, 185, 131, 0.1);
  }

  .event-icon {
    font-size: 20px;
    min-width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .event-details {
    flex: 1;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
  }

  .event-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.85rem;
  }

  .event-time {
    color: #999;
    font-size: 0.7rem;
    font-family: monospace;
  }

  .event-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .event-id-badge {
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-family: monospace;
    color: #666;
  }

  .event-description {
    color: #888;
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    .event-header {
      flex-direction: column;
      gap: 4px;
    }
  }

  @media (max-width: 480px) {
    .event-item {
      flex-direction: column;
      gap: 6px;
    }

    .event-icon {
      align-self: flex-start;
    }
  }
</style>
