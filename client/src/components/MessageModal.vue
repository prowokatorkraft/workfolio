<script setup lang="ts">
  import { ref } from 'vue';

  defineProps<{
    isOpen: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'submit', description: string): void;
  }>();

  const description = ref('');
  const isSubmitting = ref(false);

  const close = () => {
    description.value = '';
    emit('close');
  };

  const submit = () => {
    if (!description.value.trim() || isSubmitting.value) return;

    isSubmitting.value = true;
    emit('submit', description.value.trim());
    description.value = '';
    isSubmitting.value = false;
    close();
  };
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-card">
          <div class="modal-header">
            <h2 class="modal-title">
              <span>📝</span>
              <span>Оставить сообщение</span>
            </h2>
          </div>

          <div class="modal-body">
            <textarea
              id="description"
              v-model="description"
              class="modal-textarea"
              placeholder="Введите текст..."
              rows="5"
            />
          </div>

          <div class="modal-footer">
            <button class="modal-btn cancel-btn" @click="close">Отмена</button>
            <button class="modal-btn submit-btn" :disabled="!description.trim()" @click="submit">
              Отправить
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(44, 62, 80, 0.5);
    backdrop-filter: blur(2px);
  }

  .modal-card {
    width: 100%;
    max-width: 480px;
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid #42b983;
  }

  .modal-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  }

  .modal-body {
    margin-bottom: 20px;
  }

  .modal-textarea {
    width: 100%;
    box-sizing: border-box;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 12px;
    color: #2c3e50;
    font-size: 0.9rem;
    line-height: 1.5;
    font-family: inherit;
    resize: vertical;
    transition: all 0.2s ease;
    outline: none;
  }

  .modal-textarea::placeholder {
    color: #999;
  }

  .modal-textarea:hover {
    border-color: #42b983;
  }

  .modal-textarea:focus {
    border-color: #42b983;
    box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
  }

  .modal-footer {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
  }

  .modal-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    border-radius: 16px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cancel-btn {
    background: white;
    border: 1px solid #e0e0e0;
    color: #666;
  }

  .cancel-btn:hover {
    border-color: #42b983;
    color: #42b983;
    background: #e8f5e9;
  }

  .submit-btn {
    background: #42b983;
    border: 1px solid #42b983;
    color: white;
  }

  .submit-btn:hover:not(:disabled) {
    background: #369b6f;
    border-color: #369b6f;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* --- Анимация появления/исчезновения --- */

  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.2s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-from .modal-card,
  .modal-leave-to .modal-card {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
</style>
