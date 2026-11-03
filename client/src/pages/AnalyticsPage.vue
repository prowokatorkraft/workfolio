<script setup lang="ts">
  import UserGroups from '../components/analytics/UserGroups.vue';
  import DateFilter from '../components/analytics/DateFilter.vue';
  import EventGroups from '../components/analytics/EventGroups.vue';
  import MessageEvents from '../components/analytics/MessageEvents.vue';
</script>

<template>
  <main class="main-layout">
    <DateFilter />
    <UserGroups />
    <EventGroups />
    <MessageEvents />
  </main>
</template>

<style scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
</style>
