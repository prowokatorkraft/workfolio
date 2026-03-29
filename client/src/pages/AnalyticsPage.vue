<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useEvents } from '../composables/useEvents.ts';
  //import { useUserStore } from '@/stories/user.ts';

  //const counterStore = useUserStore();

  /*const loading = ref(true);
  const error = ref('');*/

  /*const fetchData = async () => {
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
  };*/

  const events = useEvents();
  onMounted(() => {
    events.fetchEvents();
    //events.addEvent({ eventId: EventEnum.open, description: 'analytics' });
  });
</script>

<template>
  <div v-for="event in events.events.value" :key="event.id">
    {{ `${event.eventId} - ${event.description}` }}
  </div>
</template>

<style scoped></style>
