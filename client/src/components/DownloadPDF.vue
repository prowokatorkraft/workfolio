<script setup lang="ts">
  import { ref } from 'vue';
  import DownloadFile from './icons/DownloadFile.vue';

  const emit = defineEmits<{
    (e: 'closed'): void;
  }>();

  const isPrinting = ref(false);

  const exportToPDF = async () => {
    if (isPrinting.value) return;
    isPrinting.value = true;
    await new Promise((resolve) => setTimeout(resolve, 100));

    const originalTitle = document.title;
    document.title = 'Danil_Tyurin_CV';
    window.print();
    document.title = originalTitle;
    emit('closed');
    setTimeout(() => {
      isPrinting.value = false;
    }, 1000);
  };
</script>

<template>
  <button
    class="pdf-badge"
    :class="{ expanded: isPrinting }"
    :disabled="isPrinting"
    @click="exportToPDF"
  >
    <span><DownloadFile /></span>
    <span id="cv-badge-name">{{ 'CV' }}</span>
    <span id="cv-badge-name-tail">{{ 'PDF' }}</span>
  </button>
</template>

<style scoped>
  .pdf-badge {
    width: max-content;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 10px 15px;

    font-size: 0.85rem;
    font-weight: 500;
    color: #2c3e50;

    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .pdf-badge:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: #42b983;
    color: #42b983;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .pdf-badge:active:not(:disabled) {
    transform: translateY(0);
  }

  .pdf-badge.expanded {
    background: #42b983;
    border-color: #42b983;
    color: white;
  }

  .pdf-badge:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 400px) {
    #cv-badge-name-tail {
      display: none;
    }
  }

  @media (max-width: 335px) {
    #cv-badge-name {
      display: none;
    }
  }

  @media print {
    .pdf-badge {
      display: none !important;
    }
  }
</style>
