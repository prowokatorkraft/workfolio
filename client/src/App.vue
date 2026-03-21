<script setup lang="ts">
  import PageHeader from './components/PageHeader.vue';
  import PageFooter from './components/PageFooter.vue';
  import SideBar from './components/side-bar/SideBar.vue';
</script>

<template>
  <PageHeader />
  <div class="layout">
    <main class="main">
      <div class="main-container">
        <section class="content">
          <RouterView />
        </section>
        <SideBar />
      </div>
    </main>
  </div>
  <PageFooter />
</template>

<style>
  .layout {
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
    grid-template-columns: 1fr 350px;
    gap: 30px;
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
