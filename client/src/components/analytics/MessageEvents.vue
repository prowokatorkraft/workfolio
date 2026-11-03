<script setup lang="ts">
  import { watch } from 'vue';
  import Pagination from './Pagination.vue';
  import PaginationSelector from './PaginationSelector.vue';
  import { useAnalyticsStore } from '../../stores/Analytics.ts';

  const analyticsStore = useAnalyticsStore();

  watch(
    () => analyticsStore.page,
    () => analyticsStore.fetchMessages()
  );
  watch(
    () => analyticsStore.pageSize,
    () => {
      analyticsStore.setPage(1);
      analyticsStore.fetchMessages();
    }
  );

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
</script>

<template>
  <div class="messages-wrapper">
    <div class="messages-header">
      <h2 class="messages-title">
        <span>✉️</span>
        <span>Оставленные сообщения</span>
        <span v-if="analyticsStore.messages?.messageCount" class="messages-stats">
          <span class="stats-badge">Всего: {{ analyticsStore.messages.messageCount }}</span>
        </span>
        <span v-if="analyticsStore.messagesLoading" class="loading-spinner">
          <span class="spinner" />
        </span>
      </h2>
      <PaginationSelector
        v-model:current-page="analyticsStore.page"
        v-model:page-size="analyticsStore.pageSize"
        :count="analyticsStore.messages?.messageCount || 0"
      />
    </div>

    <div v-if="!analyticsStore.messages?.messages?.length" class="empty-container">
      <span class="empty-icon">📭</span>
      <span>Нет оставленных сообщений</span>
    </div>

    <div v-else class="messages-container">
      <div class="messages-list">
        <div
          v-for="message in analyticsStore.messages.messages"
          :key="message.id + '-' + message.createdAt + '-' + message.userId"
          class="message-content"
        >
          <div class="message-text">{{ message.description }}</div>
          <div class="message-meta">
            <span v-if="message.userId" class="message-id-badge">{{ message.userId }}</span>
            <span class="message-time">{{ formatDate(message.createdAt) }}</span>
          </div>
        </div>
      </div>
      <Pagination
        v-model:current-page="analyticsStore.page"
        v-model:page-size="analyticsStore.pageSize"
        :count="analyticsStore.messages?.messageCount || 0"
      />
    </div>
  </div>
</template>

<style scoped>
  .messages-wrapper {
    width: 100%;
  }

  .messages-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #42b983;
    flex-wrap: wrap;
  }

  .messages-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .messages-stats {
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

  .messages-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .message-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    padding: 12px 15px;
    background: #f8f9fa;
    border-left: 1px solid #42b983;
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .message-content:hover {
    background: #f0f2f5;
    transform: translateX(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  .message-text {
    flex: 1;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #2c3e50;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .message-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding-top: 2px;
  }

  .message-id-badge {
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-family: monospace;
    color: #666;
  }

  .message-time {
    color: #999;
    font-size: 0.7rem;
    font-family: monospace;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .message-content {
      flex-direction: column;
      gap: 8px;
    }

    .message-content:hover {
      transform: none;
    }

    .message-meta {
      align-self: flex-end;
    }

    .messages-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 480px) {
    .messages-title {
      font-size: 1.2rem;
      flex-wrap: wrap;
    }
  }
</style>
