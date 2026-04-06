import { createRouter, createWebHistory } from 'vue-router';
import Resume from '../pages/ResumePage.vue';
import Training from '../pages/TrainingPage.vue';
import Analytics from '../pages/AnalyticsPage.vue';
import { EventEnum } from '../types/Event-enum-type.ts';
import { useEventStore } from '../stores/Event.ts';

const routes = [
  {
    path: '/',
    name: 'Resume',
    component: window.location.pathname === '/' ? Resume : () => import('../pages/ResumePage.vue'),
  },
  {
    path: '/training',
    name: 'Training',
    component:
      window.location.pathname === '/training'
        ? Training
        : () => import('../pages/TrainingPage.vue'),
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component:
      window.location.pathname === '/analytics'
        ? Analytics
        : () => import('../pages/AnalyticsPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const events = useEventStore();
  // Фокусировка для навигации ссылок
  if (to.hash) {
    const elementId = to.hash.slice(1);

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });

        element.classList.add('highlight-pulse');

        setTimeout(() => {
          element.classList.remove('highlight-pulse');
        }, 1500);
      }
    }, 100);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (typeof to.name === 'string' && to.name !== 'Analytics') {
    events.handleClick(EventEnum.open, to.name, 10000);
  }
});

export default router;
