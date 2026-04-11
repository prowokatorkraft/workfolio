import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type Technology, TechnologyGroup, type TechnologyGroupType } from '../types/Technology.ts';
import type { Project } from '../types/Project.ts';
import { clone, formatDuration, parsePeriod } from '../lib/tools.ts';

const initialSkills: Technology[] = [
  { id: 1, name: 'Vue.js', level: 50, group: TechnologyGroup.frontend },
  { id: 2, name: 'React', level: 50, group: TechnologyGroup.frontend },
  { id: 3, name: 'TypeScript', level: 60, group: TechnologyGroup.frontend },
  { id: 4, name: 'JavaScript', level: 80, group: TechnologyGroup.frontend },
  { id: 5, name: 'HTML/CSS', level: 80, group: TechnologyGroup.frontend },
  { id: 7, name: 'Node.js', level: 40, group: TechnologyGroup.backend },
  { id: 9, name: 'NestJS', level: 40, group: TechnologyGroup.backend },
  { id: 10, name: 'Express', level: 30, group: TechnologyGroup.backend },
  { id: 11, name: 'PostgreSQL', level: 80, group: TechnologyGroup.data },
  { id: 12, name: 'MSSQL', level: 80, group: TechnologyGroup.data },
  { id: 14, name: 'Docker', group: TechnologyGroup.none },
  { id: 15, name: 'GitLab', level: 90, group: TechnologyGroup.none },
  { id: 17, name: 'Jest', level: 70, group: TechnologyGroup.none },
  { id: 18, name: 'JIRA', group: TechnologyGroup.none },
  { id: 19, name: '.NET Framework', level: 95, group: TechnologyGroup.backend },
  { id: 20, name: 'ASP.NET', level: 75, group: TechnologyGroup.backend },
  { id: 21, name: 'Web API', level: 90, group: TechnologyGroup.backend },
  { id: 22, name: 'ActiveMQ', group: TechnologyGroup.backend },
  { id: 23, name: 'Elasticsearch', level: 15, group: TechnologyGroup.data },
  { id: 24, name: 'PDF reactor', level: 25, group: TechnologyGroup.backend },
  { id: 25, name: 'ADO.NET', level: 95, group: TechnologyGroup.backend },
  { id: 26, name: 'Entity Framework', level: 80, group: TechnologyGroup.backend },
  { id: 27, name: 'C#', level: 100, group: TechnologyGroup.backend },
  { id: 28, name: 'Web Forms', level: 50, group: TechnologyGroup.backend },
  { id: 29, name: 'ExtJS', level: 60, group: TechnologyGroup.frontend },
  { id: 30, name: 'Visual Basic', level: 30, group: TechnologyGroup.backend },
  { id: 31, name: 'Works', group: TechnologyGroup.none },
  { id: 32, name: 'Microservices', group: TechnologyGroup.architecture },
  { id: 33, name: 'Monolith', group: TechnologyGroup.architecture },
  { id: 34, name: '.NET Core', level: 80, group: TechnologyGroup.backend },
  { id: 35, name: 'Razor', level: 50, group: TechnologyGroup.backend },
  { id: 36, name: 'Kafka', level: 0, group: TechnologyGroup.backend },
  { id: 37, name: 'Redmine', group: TechnologyGroup.backend },
  { id: 38, name: 'Nx', group: TechnologyGroup.frontend },
  { id: 39, name: 'Java', level: 45, group: TechnologyGroup.backend },
  { id: 40, name: 'Spring', level: 30, group: TechnologyGroup.backend },
  { id: 41, name: 'Hibernate', level: 30, group: TechnologyGroup.backend },
  { id: 42, name: 'JUnit', level: 45, group: TechnologyGroup.backend },
];

const initialProjects: Project[] = [
  {
    id: 1,
    periodStart: '2024-03-11',
    title: 'Комплекс расчетов оценки стоимости строительства 2.0',
    company: 'Газпром ЦПС',
    shortDescription:
      'Разработка и поддержка инструмента стоимостного инжиниринга инвестиционных проектов для строительства, реконструкции, капитального ремонта и диагностики объектов газовой отрасли, а также строительства скважин.',
    detailedDescription:
      'В качестве бэкенд-разработчика участвовал в разработке кроссплатформенного микросервисного приложения, созданного на основе предыдущей версии программного обеспечения. Проект реализовывался в рамках импортозамещения, работа велась в составе одной из нескольких команд разработки.',
    technologyIds: [27, 34, 25, 26, 11, 21, 20, 5, 3, 2, 38, 39, 40, 41, 42, 36, 14, 15, 31, 32],
    achievements: ['Мигрировал данные из MSSQL в PSQL', 'Оптимизировал хранимые процедуры'],
    isExpanded: false,
  },
  {
    id: 2,
    periodStart: '2022-05-23',
    periodEnd: '2024-03-10',
    title: 'Комплекс расчетов оценки стоимости строительства 1.0',
    company: 'Газпром ЦПС',
    shortDescription:
      'Разработка и поддержка инструмента стоимостного инжиниринга инвестиционных проектов для строительства, реконструкции, капитального ремонта и диагностики объектов газовой отрасли, а также строительства скважин.',
    detailedDescription:
      'Поддерживаю и развиваю монолитную систему, работая как с клиентской частью, так и с серверной логикой. Выполняю доработку интерфейсов, расчетных алгоритмов, механизмов выгрузки данных, оптимизирую запросы к базам данных. Участвую в командном взаимодействии, обеспечивая согласованность решений на всех этапах разработки.',
    technologyIds: [27, 19, 25, 26, 12, 20, 21, 5, 4, 35, 28, 29, 30, 15, 37, 33],
    achievements: ['Разрабатывал динамику в системе настроек админа'],
    isExpanded: false,
  },
  {
    id: 3,
    periodStart: '2021-05-17',
    periodEnd: '2022-04-15',
    title: 'Raiffeisen Live',
    company: 'Epam Systems',
    shortDescription: 'Разработка и поддержка страховой платформы',
    detailedDescription:
      'В роли фулстек‑разработчика обеспечиваю поддержку страховой платформы и конфигурирование её ядра под потребности заказчика в рамках команды численностью около 15 человек.',
    technologyIds: [4, 21, 20, 18, 15, 19, 22, 23, 24],
    achievements: [
      'Внедрил новый функционал',
      'Исправлял ошибки в отладчике, внес массовые исправления в базу данных',
      'Работал с пользовательским интерфейсом, выводом данных в форматы PDF и Excel, отправкой уведомлений клиентам',
      'Участвовал в совещаниях команды Scrum (ежедневные, планирование, демонстрации, ретроспектива)',
    ],
    isExpanded: false,
  },
];

export const useExperienceStore = defineStore('experience', () => {
  const technology = ref<Technology[]>([...clone(initialSkills)]);
  const projects = ref<Project[]>([...clone(initialProjects)]);

  const getTechnologyByGroup = (group: TechnologyGroupType) => {
    return computed(() => technology.value.filter((s) => s.group === group));
  };

  const getTechnologyByIds = (ids: number[]) => {
    return computed(() => {
      const techs: Technology[] = [];
      ids.forEach((id) => {
        const tech = technology.value.find((t) => t.id === id);
        if (tech) {
          techs.push(tech);
        }
      });
      return techs;
    });
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
    technology.value = clone(initialSkills);
    projects.value = clone(initialProjects);
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
    resetToInitial,
  };
});
