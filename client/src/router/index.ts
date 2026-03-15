import { createRouter, createWebHistory } from 'vue-router';
import Resume from '../pages/ResumePage.vue';

const routes = [
  {
    path: '/',
    name: 'Resume',
    component: Resume
  },
  {
    path: '/education',
    name: 'Education',
    component: () => import('../pages/EducationPage.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../pages/AnalyticsPage.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/AboutPage.vue')
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

export default router;
