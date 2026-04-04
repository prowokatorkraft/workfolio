<script setup lang="ts">
  import { useUserStore } from '../stores/User.ts';
  import { EventEnum } from '../types/Event-enum-type.ts';
  import { useEventStore } from '../stores/Event.ts';

  const currentYear = new Date().getFullYear();
  const user = useUserStore().user;
  const events = useEventStore();
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">© {{ currentYear }} {{ user.name }}</p>
      <p class="made-with">
        Сделано с
        <span class="heart">❤️</span>
        на
        <RouterLink
          to="/training#pet-project1"
          class="nav-link"
          @click="events.handleClick(EventEnum.footer_vue_link)"
        >
          Vue.js
        </RouterLink>
      </p>
    </div>
  </footer>
</template>

<style scoped>
  .footer {
    background: white;
    border-top: 1px solid #e9ecef;
    padding: 20px 0;
    margin-top: auto;
  }

  .footer-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
    font-size: 0.9rem;
  }

  .copyright {
    margin: 0;
  }

  .made-with {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .heart {
    color: #ff6b6b;
    animation: heartbeat 1.5s ease infinite;
    display: inline-block;
  }

  .nav-link {
    text-decoration: none;
  }

  @keyframes heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      gap: 10px;
      text-align: center;
    }
  }
</style>
