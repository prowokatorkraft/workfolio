<script setup lang="ts">
  import { computed, useSlots } from 'vue';

  defineProps<{
    value: string | undefined;
  }>();

  const slots = useSlots();

  const hasContent = computed(() => {
    return !!slots.default && slots.default().length > 0;
  });
</script>

<template>
  <span v-if="hasContent" class="nav">
    <a v-if="value" :href="value" target="_blank" class="nav-link">
      <slot class="nav" />
    </a>
    <slot v-else />
  </span>
</template>

<style scoped>
  .nav {
  }

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
