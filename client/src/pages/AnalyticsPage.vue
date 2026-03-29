<script setup>
  import { onMounted, ref } from 'vue';
  //import { useUserStore } from '@/stories/user.ts';

  //const counterStore = useUserStore();

  const data = ref('Loading...');
  const loading = ref(true);
  const error = ref('');

  const fetchData = async () => {
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(baseUrl + '/api/logger');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data.value = await response.text();
    } catch (err) {
      error.value = `Ошибка загрузки: ${err.message}`;
    } finally {
      loading.value = false;
    }
  };
  onMounted(() => {
    fetchData();
  });
</script>

<template>
  {{ data }}
</template>

<style scoped></style>
