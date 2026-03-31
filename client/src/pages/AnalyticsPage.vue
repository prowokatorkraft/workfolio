<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAnalytics } from '../composables/useAnalytics.ts';

  const analytics = useAnalytics();
  onMounted(() => {
    analytics.fetchAnalytics();
  });
</script>

<template>
  {{ (analytics.loading.value ? 'Загрузка ...' : analytics.analytics) }}
</template>

<style scoped></style>
