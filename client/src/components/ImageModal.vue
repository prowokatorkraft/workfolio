<script setup lang="ts">
  import { ref } from 'vue';

  const modalVisible = ref(false);
  const modalImage = ref('');

  const openModal = (imageUrl: string) => {
    modalImage.value = imageUrl;
    modalVisible.value = true;
    document.body.style.overflow = 'hidden';
  };

  //@click.stop
  const closeModal = () => {
    modalVisible.value = false;
    modalImage.value = '';
    document.body.style.overflow = '';
  };

  const emit = defineEmits<{
    (e: 'openHandler', value: (imageUrl: string) => void): void;
  }>();
  emit('openHandler', openModal);
</script>

<template>
  <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content">
      <button class="modal-close" @click="closeModal">✕</button>
      <img :src="modalImage" alt="modal" class="modal-image" />
    </div>
  </div>
</template>

<style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes zoomIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  .modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    animation: zoomIn 0.3s ease;
  }

  .modal-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    transition: transform 0.2s ease;
  }

  .modal-close:hover {
    transform: scale(1.1);
    color: #42b983;
  }

  .modal-image {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
</style>
