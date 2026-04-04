<script setup lang="ts">
  defineProps<{
    rotated: boolean;
  }>();
</script>
<template>
  <svg class="arrow-icon" :class="{ rotated: rotated }" width="14" height="14" viewBox="0 0 14 14">
    <path
      d="M3.5 5.25L7 8.75L10.5 5.25"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
  .arrow-icon {
    transition: transform 0.2s ease;
  }

  .arrow-icon.rotated {
    transform: rotate(180deg);
  }
</style>
