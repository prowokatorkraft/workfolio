import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type Technology, TechnologyGroup, type TechnologyGroupType } from '../types/Technology.ts';
import type { Project } from '../types/Project.ts';
import { formatDuration, parsePeriod } from '../lib/tools.ts';

const initialSkills: Technology[] = [
  { id: 1, name: 'Vue.js', level: 90, group: TechnologyGroup.frontend },
  { id: 2, name: 'React', level: 75, group: TechnologyGroup.frontend },
  { id: 3, name: 'TypeScript', level: 85, group: TechnologyGroup.frontend },
  { id: 4, name: 'JavaScript', level: 95, group: TechnologyGroup.frontend },
  { id: 5, name: 'HTML/CSS', level: 100, group: TechnologyGroup.frontend },
  { id: 6, name: 'Tailwind', level: 3, group: TechnologyGroup.frontend },

  { id: 7, name: 'Node.js', level: 85, group: TechnologyGroup.backend },
  { id: 8, name: 'Python', level: 15, group: TechnologyGroup.backend },
  { id: 9, name: 'NestJS', level: 75, group: TechnologyGroup.backend },
  { id: 10, name: 'Express', level: 80, group: TechnologyGroup.backend },

  { id: 11, name: 'PostgreSQL', level: 75, group: TechnologyGroup.data },
  { id: 12, name: 'MongoDB', level: 5, group: TechnologyGroup.data },
  { id: 13, name: 'Redis', level: 45, group: TechnologyGroup.data },

  { id: 14, name: 'Docker', level: 60, group: TechnologyGroup.none },
  { id: 15, name: 'Git', level: 85, group: TechnologyGroup.none },
  { id: 16, name: 'Figma', level: 70, group: TechnologyGroup.none },
  { id: 17, name: 'Jest', level: 65, group: TechnologyGroup.none }
];

const initialProjects: Project[] = [
  {
    id: 1,
    periodStart: '2024-05-01',
    title: 'CRM система',
    company: 'ООО "ТехноПрогресс"',
    shortDescription: 'Разработка внутренней CRM системы для управления клиентами',
    detailedDescription:
      'Полная переработка существующей CRM системы. Реализована система авторизации, дашборды с графиками, управление задачами в реальном времени, интеграция с внешними API. Оптимизация производительности увеличила скорость загрузки на 40%.',
    technologyIds: [1, 2, 3, 4, 5, 6],
    achievements: [
      'Увеличил производительность на 40%',
      'Внедрил 5 новых модулей',
      'Сократил время загрузки'
    ],
    isExpanded: false
  },
  {
    id: 2,
    periodStart: '2023-05-01',
    periodEnd: '2024-04-01',
    title: 'Мобильное приложение',
    company: 'FoodDelivery Inc',
    shortDescription: 'Разработка приложения для доставки еды',
    detailedDescription:
      'Создание кроссплатформенного приложения. Реализован функционал отслеживания заказов, интеграция с картами, система оплаты, push-уведомления. Приложение обслуживает более 10 000 пользователей ежемесячно.',
    technologyIds: [7, 8, 9, 10],
    achievements: [
      '10 000+ активных пользователей',
      'Интеграция с 3 платежными системами',
      '4.8★ в сторах'
    ],
    isExpanded: false
  },
  {
    id: 3,
    periodStart: '2021-05-01',
    periodEnd: '2021-11-01',
    title: 'Raiffeisen Live',
    company: 'Epam Systems',
    shortDescription: 'Разработка и поддержка страховой платформы',
    detailedDescription:
      'В роли фулстек‑разработчика обеспечиваю поддержку страховой платформы и конфигурирование её ядра под потребности заказчика в рамках команды численностью около 15 человек.',
    technologyIds: [11, 12, 13],
    achievements: [
      'Внедрил новый функционал в библиотеку',
      'Работал с пользовательским интерфейсом, выводом данных в форматы PDF и Excel, отправкой уведомлений клиентам',
      'Исправлял ошибки в отладчике, внес массовые исправления в базу данных',
      'Участвовал в совещаниях команды Scrum (ежедневные, планирование, демонстрации, ретроспектива)'
    ],
    isExpanded: false
  }
];

export const useExperienceStore = defineStore('experience', () => {
  // State
  const technology = ref<Technology[]>([...initialSkills]);
  const projects = ref<Project[]>([...initialProjects]);

  const getTechnologyByGroup = (group: TechnologyGroupType) => {
    return computed(() => technology.value.filter((s) => s.group === group));
  };

  const getTechnologyByIds = (ids: number[]) => {
    return computed(() => technology.value.filter((s) => ids.includes(s.id)));
  };

  const getProjectPeriod = (id: number) => {
    return computed(() => {
      const project = projects.value.find((p) => p.id === id);
      if (project) {
        return parsePeriod(project.periodStart, project.periodEnd).period;
      }
      return '';
    });
  };

  const getProjectDuration = (id: number) => {
    return computed(() => {
      const project = projects.value.find((p) => p.id === id);
      if (project) {
        const period = parsePeriod(project.periodStart, project.periodEnd);
        return formatDuration(period.durationMonths);
      }
      return '';
    });
  };

  const duration = computed(() => {
    let durationMonths = 0;
    projects.value.forEach(
      (p) => (durationMonths += parsePeriod(p.periodStart, p.periodEnd).durationMonths)
    );
    return formatDuration(durationMonths);
  });

  function toggleProject(id: number) {
    const project = projects.value.find((p) => p.id === id);
    if (project) {
      project.isExpanded = !project.isExpanded;
    }
  }

  function addTechnology(tech: Technology) {
    technology.value.push(tech);
  }

  function updateTechnology(id: number, updates: Partial<Technology>) {
    const index = technology.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      technology.value[index] = { ...technology.value[index], ...updates };
    }
  }

  function removeTechnology(id: number) {
    const index = technology.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      technology.value.splice(index, 1);
    }
  }

  function addProject(project: Project) {
    projects.value.push(project);
  }

  function updateProject(id: number, updates: Partial<Project>) {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updates };
    }
  }

  function removeProject(id: number) {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects.value.splice(index, 1);
    }
  }

  function expandProject(id: number) {
    const project = projects.value.find((p) => p.id === id);
    if (project) {
      project.isExpanded = true;
    }
  }

  function collapseProject(id: number) {
    const project = projects.value.find((p) => p.id === id);
    if (project) {
      project.isExpanded = false;
    }
  }

  function collapseAllProjects() {
    projects.value.forEach((p) => (p.isExpanded = false));
  }

  function expandAllProjects() {
    projects.value.forEach((p) => (p.isExpanded = true));
  }

  function resetToInitial() {
    technology.value = [...initialSkills];
    projects.value = [...initialProjects];
  }

  return {
    technology,
    projects,
    duration,

    getTechnologyByGroup,
    getTechnologyByIds,
    getProjectPeriod,
    getProjectDuration,

    addTechnology,
    updateTechnology,
    removeTechnology,
    addProject,
    updateProject,
    removeProject,
    toggleProject,
    expandProject,
    collapseProject,
    collapseAllProjects,
    expandAllProjects,
    resetToInitial
  };
});
