<script setup lang="ts">
  import { useUserStore } from '../../stores/User.ts';

  const userStore = useUserStore();
  const location = userStore.user.location;
</script>

<template>
  <div class="location-block">
    <p class="user-location">
      <span>📍 {{ location.city }}, {{ location.country }}</span>
      <span class="tooltip-icon" :data-tooltip="userStore.canBusinessTrip">✈️</span>
      <span class="tooltip-icon" :data-tooltip="userStore.canRelocate">🏠</span>
    </p>
  </div>
</template>

<style scoped>
  .user-location {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tooltip-icon {
    font-size: 0.9rem;
    cursor: help;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .tooltip-icon:hover {
    opacity: 1;
  }

  .tooltip-icon {
    position: relative;
  }

  .tooltip-icon:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #2c3e50;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    white-space: nowrap;
    margin-bottom: 5px;
    z-index: 10;
  }

  .tooltip-icon:hover::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #2c3e50;
    margin-bottom: -5px;
  }
</style>
