<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useAnalyticsStore } from '../../stores/Analytics.ts';
  import { formatDate } from '../../lib/tools.ts';

  const analyticsStore = useAnalyticsStore();

  const showCustomPicker = ref(false);
  const pickerRef = ref<HTMLElement | null>(null);
  const startDate = ref<string>(analyticsStore.dateFrom ?? formatDate(new Date()));
  const endDate = ref<string>(analyticsStore.dateTo ?? formatDate(new Date()));
  const isCustomRange = computed(() => analyticsStore.activePreset === 'custom');

  const selectPreset = (presetValue: string) => {
    analyticsStore.setActivePreset(presetValue);
    const preset = analyticsStore.presets.find((p) => p.value === presetValue);
    if (preset) {
      const range = preset.getRange();
      analyticsStore.setDateFrom(range.startDate);
      analyticsStore.setDateTo(range.endDate);
      analyticsStore.fetchUserGroups();
    }
    closeCustomPicker();
  };

  const openCustomPicker = () => {
    if (showCustomPicker.value) {
      closeCustomPicker();
      return;
    }
    startDate.value = analyticsStore.dateFrom ?? formatDate(new Date());
    endDate.value = analyticsStore.dateTo ?? formatDate(new Date());
    showCustomPicker.value = true;
  };
  const closeCustomPicker = () => {
    showCustomPicker.value = false;
  };
  const applyCustomRange = () => {
    if (startDate.value && endDate.value) {
      analyticsStore.setDateFrom(startDate.value);
      analyticsStore.setDateTo(endDate.value);
      analyticsStore.setActivePreset('custom');
      analyticsStore.fetchUserGroups();
    }
    closeCustomPicker();
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
      const target = event.target as HTMLElement;
      if (!target.closest('.preset-button')) {
        closeCustomPicker();
      }
    }
  };
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && showCustomPicker.value) {
      closeCustomPicker();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    selectPreset(analyticsStore.activePreset);
  });
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleEscape);
  });
</script>

<template>
  <div class="date-range-wrapper">
    <div class="date-range-buttons">
      <button
        v-for="preset in analyticsStore.presets"
        :key="preset.value"
        class="preset-button"
        :class="{ active: analyticsStore.activePreset === preset.value }"
        @click="selectPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
      <button
        class="preset-button custom-button"
        :class="{ active: isCustomRange }"
        @click="openCustomPicker"
      >
        📅 Свой диапазон
      </button>
    </div>

    <div v-if="showCustomPicker" ref="pickerRef" class="custom-picker">
      <div class="picker-header">
        <span>Выберите диапазон</span>
        <button class="close-button" @click="closeCustomPicker">×</button>
      </div>
      <div class="picker-content">
        <div class="date-input-group">
          <label>С</label>
          <input v-model="startDate" type="date" :max="analyticsStore.dateTo" />
        </div>
        <div class="date-input-group">
          <label>По</label>
          <input v-model="endDate" type="date" :min="analyticsStore.dateFrom" />
        </div>
      </div>
      <div class="picker-actions">
        <button class="apply-button" @click="applyCustomRange">Применить</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .date-range-wrapper {
    position: relative;
    display: inline-block;
  }

  .date-range-buttons {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: right;
  }

  .preset-button {
    background: #f0f0f0;
    border: 1px solid #e0e0e0;
    color: #666;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .preset-button:hover {
    border-color: #42b983;
    color: #42b983;
    background: #f8f9fa;
  }

  .preset-button.active {
    background: #42b983;
    border-color: #42b983;
    color: white;
  }

  .custom-button {
    background: white;
  }

  .custom-picker {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 280px;
  }

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 500;
    color: #2c3e50;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .close-button:hover {
    background: #f0f0f0;
    color: #666;
  }

  .picker-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .date-input-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .date-input-group label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #666;
    width: 24px;
  }

  .date-input-group input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.85rem;
    font-family: monospace;
    transition: all 0.2s ease;
  }

  .date-input-group input:focus {
    outline: none;
    border-color: #42b983;
    box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
  }

  .picker-actions {
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
  }

  .apply-button {
    background: #42b983;
    border: none;
    color: white;
    padding: 6px 16px;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .apply-button:hover {
    background: #359c6e;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .date-range-buttons {
      gap: 4px;
    }

    .preset-button {
      padding: 4px 10px;
      font-size: 0.75rem;
    }

    .custom-picker {
      position: fixed;
      top: auto;
      bottom: 50%;
      left: 50%;
      right: auto;
      transform: translate(-50%, 50%);
      width: calc(100% - 32px);
      max-width: 320px;
    }
  }
</style>
