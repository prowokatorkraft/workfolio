<script setup lang="ts">
  import PageHeader from './components/PageHeader.vue';
  import PageFooter from './components/PageFooter.vue';
  import SideBar from './components/side-bar/SideBar.vue';
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const currentRoute = ref<string>('');
  const route = useRoute();
  watch(
    () => route.name,
    (name) => {
      currentRoute.value = (name ?? '').toString();
    },
    { immediate: true }
  );

  const mainContainer = computed(() => {
    const sideBar = currentRoute.value !== 'Analytics' ? 'side-bar' : '';
    return `main-container ${sideBar}`;
  });
</script>

<template>
  <PageHeader :current-route="currentRoute" />
  <div class="layout">
    <main class="main">
      <div :class="mainContainer">
        <section class="content">
          <RouterView />
        </section>
        <SideBar v-if="currentRoute != 'Analytics'" />
      </div>
    </main>
  </div>
  <PageFooter />
</template>

<style>
  .layout {
    margin-top: -16px;
    min-height: 85vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  }

  .main {
    flex: 1;
    padding: 30px 20px;
  }

  .main-container {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    gap: 30px;
  }

  .side-bar {
    grid-template-columns: 1fr 350px;
  }

  .content {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    min-height: 600px;
  }

  @media (max-width: 1024px) {
    .main-container {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .content {
      padding: 20px;
    }
  }

  .highlight-pulse {
    animation: pulse 1.5s ease;
    outline: none !important;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(66, 185, 131, 0.4);
      background-color: rgba(66, 185, 131, 0.1);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(66, 185, 131, 0);
      background-color: rgba(66, 185, 131, 0.2);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(66, 185, 131, 0);
      background-color: rgba(66, 185, 131, 0);
    }
  }
</style>
