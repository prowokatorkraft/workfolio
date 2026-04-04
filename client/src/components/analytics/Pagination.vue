<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    pageSize: number;
    currentPage: number;
    count: number;
  }>();
  const emit = defineEmits<{
    'update:currentPage': [value: number];
  }>();

  const changePage = (newPage: number) => {
    emit('update:currentPage', newPage);
  };

  const totalPages = computed(() => {
    const groupCount = props.count || 0;
    return Math.ceil(groupCount / props.pageSize);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      changePage(page);
    }
  };
  const nextPage = () => {
    if (props.currentPage < totalPages.value) {
      changePage(props.currentPage + 1);
    }
  };
  const prevPage = () => {
    if (props.currentPage > 1) {
      changePage(props.currentPage - 1);
    }
  };

  const displayedPages = computed(() => {
    const pages: (number | string)[] = [];
    const total = totalPages.value;
    const current = props.currentPage;
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      if (current <= 3) {
        start = 2;
        end = 4;
      }
      if (current >= total - 2) {
        start = total - 3;
        end = total - 1;
      }

      if (start > 2) {
        pages.push('...');
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < total - 1) {
        pages.push('...');
      }

      pages.push(total);
    }

    return pages;
  });
</script>

<template>
  <div v-if="totalPages > 1" class="pagination-container">
    <div class="pagination-controls">
      <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div class="pagination-pages">
        <button
          v-for="page in displayedPages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page, dots: page === '...' }"
          :disabled="page === '...'"
          @click="typeof page === 'number' ? goToPage(page) : null"
        >
          {{ page }}
        </button>
      </div>

      <button class="pagination-btn" :disabled="currentPage === totalPages" @click="nextPage">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    padding-top: 10px;
    border-top: 1px solid #e0e0e0;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pagination-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: white;
    border: 1px solid #e0e0e0;
    color: #2c3e50;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pagination-btn:hover:not(:disabled) {
    border-color: #42b983;
    color: #42b983;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-pages {
    display: flex;
    gap: 6px;
  }

  .page-btn {
    min-width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #e0e0e0;
    color: #2c3e50;
    border-radius: 8px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-btn:hover:not(.dots):not(:disabled) {
    border-color: #42b983;
    color: #42b983;
  }

  .page-btn.active {
    background: #42b983;
    border-color: #42b983;
    color: white;
  }

  .page-btn.dots {
    border: none;
    background: transparent;
    cursor: default;
    pointer-events: none;
  }

  .page-size-selector select {
    padding: 5px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    color: #2c3e50;
    font-size: 0.85rem;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;
  }

  .page-size-selector select:hover {
    border-color: #42b983;
  }

  .page-size-selector select:focus {
    border-color: #42b983;
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
  }

  @media (max-width: 900px) {
    .pagination-container {
      flex-direction: column;
      gap: 12px;
    }
  }

  @media (max-width: 768px) {
    .pagination-controls {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
