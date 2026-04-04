<script setup lang="ts">
  import UserGroups from '../components/analytics/UserGroups.vue';
  import DateFilter from '../components/analytics/DateFilter.vue';
  import EventGroups from '../components/analytics/EventGroups.vue';
</script>

<template>
  <main class="main-layout">
    <DateFilter />
    <UserGroups />
    <EventGroups />
  </main>
</template>

<style scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
</style>
