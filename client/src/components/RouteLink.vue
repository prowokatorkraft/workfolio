<script setup lang="ts">
  defineProps<{
    to: string;
  }>();
</script>

<template>
  <RouterLink :to="to" class="nav-link">
    <slot />
  </RouterLink>
</template>

<style scoped>
  .nav-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    flex-flow: row;
    gap: 3px;
  }

  .nav-link:any-link {
    color: inherit;
    text-decoration: none;
  }

  .nav-link:-webkit-any-link {
    color: inherit;
    text-decoration: none;
  }

  .nav-link:hover {
    color: #42b983;
  }
</style>
