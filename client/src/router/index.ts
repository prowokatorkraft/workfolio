import { createRouter, createWebHistory } from 'vue-router';
import Resume from '../pages/ResumePage.vue';

const routes = [
  {
    path: '/',
    name: 'Resume',
    component: Resume
  },
  {
    path: '/training',
    name: 'Training',
    component: () => import('../pages/TrainingPage.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../pages/AnalyticsPage.vue')
  }
  /*{
    path: '/user/:id',
    name: 'User',
    component: () => import('../'),
    props: true
  }*/
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Фокусировка для навигации
router.afterEach((to) => {
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
          behavior: 'smooth'
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
});

export default router;
