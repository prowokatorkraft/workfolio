<script setup lang="ts">
  import { ref } from 'vue';
  import type { ToastToggler } from '../types/ToastToggler.ts';

  const description = ref('');
  const symbol = ref<string | undefined>(undefined);
  const showToast = ref(false);
  const toggle = (value: string, iconSymbol?: string, time?: number) => {
    description.value = value;
    showToast.value = true;
    if (iconSymbol) {
      symbol.value = iconSymbol;
    }
    setTimeout(() => {
      showToast.value = false;
    }, time ?? 1000);
  };

  const emit = defineEmits<{
    (e: 'toggle', value: ToastToggler): void;
  }>();
  emit('toggle', toggle);
</script>

<template>
  <Transition name="toast">
    <div v-if="showToast" class="toast-notification">
      <span v-show="symbol">{{ symbol }}</span>
      <span>{{ description }}</span>
    </div>
  </Transition>
</template>

<style scoped>
  .toast-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 9999;
    white-space: nowrap;
    backdrop-filter: blur(10px);
    pointer-events: none;
    display: inline-flex;
    flex-direction: row;
    gap: 10px;
  }

  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }

  @media (max-width: 540px) {
    .toast-notification {
      white-space: wrap;
      align-items: center;
    }
  }

  @media (max-width: 335px) {
    .toast-notification {
      flex-direction: column;
    }
  }
</style>
