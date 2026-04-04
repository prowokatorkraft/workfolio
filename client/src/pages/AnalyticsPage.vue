<script setup lang="ts">
  import UserGroups from '../components/analytics/UserGroups.vue';
  import DateFilter from '../components/analytics/DateFilter.vue';
  import Events from '../components/analytics/Events.vue';
</script>

<template>
  <main class="main-layout">
    <DateFilter />
    <Events />
    <UserGroups />
  </main>
</template>

<style scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
