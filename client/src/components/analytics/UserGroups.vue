<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Pagination from './Pagination.vue';
  import GroupEvents from './GroupEvents.vue';
  import Expand from '../icons/Expand.vue';
  import PaginationSelector from './PaginationSelector.vue';
  import { useAnalyticsStore } from '../../stores/Analytics.ts';

  const analyticsStore = useAnalyticsStore();

  watch(
    () => analyticsStore.page,
    () => {
      expandedUsers.value.clear();
      analyticsStore.fetchUserGroups();
    }
  );
  watch(
    () => analyticsStore.pageSize,
    () => {
      expandedUsers.value.clear();
      analyticsStore.setPage(1);
      analyticsStore.fetchUserGroups();
    }
  );

  const expandedUsers = ref<Set<string>>(new Set());
  const isExpanded = (userId: string) => expandedUsers.value.has(userId);
  const toggleUser = (userId: string) => {
    if (expandedUsers.value.has(userId)) {
      expandedUsers.value.delete(userId);
    } else {
      expandedUsers.value.add(userId);
    }
  };
</script>

<template>
  <div class="users-wrapper">
    <div class="users-header">
      <h2 class="users-title">
        <span>👥</span>
        <span class="users-title-description">
          <span>Активность пользователей</span>
          <span class="users-label-right">
            {{ analyticsStore.userGroups?.groupCount || 0 }} пользователей
          </span>
          <span class="users-label-right">
            {{ analyticsStore.userGroups?.eventCount || 0 }} событий
          </span>
        </span>
      </h2>
      <PaginationSelector
        v-model:current-page="analyticsStore.page"
        v-model:page-size="analyticsStore.pageSize"
        :count="analyticsStore.userGroups?.groupCount || 0"
      />
    </div>

    <div v-if="analyticsStore.userGroupsLoading" class="loading-container">
      <div class="spinner" />
    </div>

    <div v-else-if="!analyticsStore.userGroups?.groups.length" class="empty-container">
      <span class="empty-icon">📭</span>
      <span>Нет данных о событиях</span>
    </div>

    <div v-else class="users-container">
      <div v-for="group in analyticsStore.userGroups.groups" :key="group.userId" class="user-row">
        <div class="user-content">
          <div class="user-header">
            <span class="user-title">{{ group.userId }}</span>
          </div>

          <div class="user-panel">
            <button
              class="expand-button"
              :class="{ expanded: isExpanded(group.userId) }"
              @click="toggleUser(group.userId)"
            >
              <span>{{ isExpanded(group.userId) ? 'Свернуть события' : 'Показать события' }}</span>
              <Expand :rotated="isExpanded(group.userId)" />
            </button>
            <span class="event-count-badge">{{ group.eventCount }} событий</span>
          </div>
        </div>
        <GroupEvents :group="group" :is-expanded="isExpanded" />
      </div>
      <Pagination
        v-model:current-page="analyticsStore.page"
        v-model:page-size="analyticsStore.pageSize"
        :count="analyticsStore.userGroups?.groupCount || 0"
      />
    </div>
  </div>
</template>

<style scoped>
  .users-wrapper {
    width: 100%;
  }

  .users-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #42b983;
  }

  .users-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .users-title-description {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .users-label-right {
    font-weight: 500;
    color: #666;
    background: #f0f0f0;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.85rem;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 20px;
    gap: 16px;
    color: #666;
  }

  .spinner {
    width: 40px;
    height: 40px;
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

  .users-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .user-row {
    display: table-column-group;
    align-items: flex-start;
    gap: 15px;
    font-size: 0.9rem;
  }

  .event-count-badge {
    color: #42b983;
    font-size: 0.8rem;
    background: #e8f5e9;
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    width: fit-content;
    font-weight: 500;
    height: fit-content;
  }

  .user-content {
    flex: 1;
    background: #f8f9fa;
    border-radius: 12px;
    padding: 15px;
    transition: all 0.2s ease;
  }

  .user-content:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  .user-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .user-panel {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .user-title {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
    font-family: monospace;
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

  @media (max-width: 768px) {
    .user-row {
      flex-direction: column;
      gap: 8px;
    }

    .user-content:hover {
      transform: none;
    }

    .user-header {
      flex-direction: column;
      gap: 6px;
    }
  }

  @media (max-width: 480px) {
    .users-title-description {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
