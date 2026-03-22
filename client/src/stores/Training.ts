import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Certificate } from '../types/Certificate.ts';
import type { PetProject } from '../types/PetProject.ts';
import type { FormalEducation } from '../types/FormalEducation.ts';

const initialFormalEducation: FormalEducation[] = [
  {
    id: 1,
    period: '2018 — 2023',
    status: 'Высшее техническое',
    degree: 'Магистр прикладной математики и информатики',
    institution: 'СГАУ, Агроинженерия',
    description:
      'Фундаментальная подготовка в области математического моделирования и разработки программного обеспечения.',
    specialization: 'Математическое моделирование и программная инженерия'
  },
  {
    id: 2,
    period: '2016 — 2018',
    status: 'Среднее профессиональное',
    degree: 'Специалист по информационным системам',
    institution: 'Колледж информационных технологий',
    description: 'Базовая подготовка в области программирования, баз данных и веб-технологий.',
    specialization: 'Программирование и администрирование БД'
  }
];

const initialCertificates: Certificate[] = [
  {
    id: 1,
    icon: 'placeholder.svg',
    name: 'JavaScript Developer. Professional',
    issuer: 'Otus',
    date: '2026',
    hours: 49,
    skills: [
      'TypeScript',
      'SPA',
      'CI/CD',
      'Vite/Webpack',
      'React',
      'Hooks',
      'Redux',
      'Zustand',
      'React Query',
      'React Router',
      'React Testing Library',
      'Jest',
      'Vue3',
      'Composition API',
      'Pinia',
      'Nuxt',
      'Next',
      'Nx',
      'Node.js',
      'REST API',
      'Express',
      'Event Loop',
      'NestJS',
      'TypeORM'
    ],
    courseLink: 'https://otus.ru/lessons/javascript-professional/',
    repo: 'https://github.com/prowokatorkraft/Otus_javascript_professional',
    petProjectId: 1
  },
  {
    id: 2,
    icon: 'certificate_postgres.png',
    name: 'PostgreSQL для администраторов баз данных и разработчиков',
    issuer: 'Otus',
    date: '2023',
    hours: 126,
    credentialId: '1718-373607',
    credentialLink: 'https://otus.ru/certificate/e317649f56324453b042f56b7ea628bb/',
    skills: [
      'PSQL',
      'Query Optimization',
      'Indexes',
      'Transactions',
      'MVCC',
      'Vacuum/Autovacuum',
      'Interlocks',
      'Replication'
    ],
    courseLink: 'https://otus.ru/lessons/postgresql-dba/',
    repo: 'https://github.com/prowokatorkraft/Otus_PostgreSQL'
  },
  {
    id: 3,
    icon: 'epam_training.png',
    name: 'Основы программного обеспечения разработка на .NET/WEB-сайтах',
    issuer: 'EPAM Systems',
    date: '2020',
    hours: 0,
    skills: [
      'OOP',
      '.NET Framework/Core',
      'ASP.NET',
      'HTML',
      'CSS',
      'JavaScript',
      'Bootstrap',
      'Razor',
      'AJAX',
      'MVC',
      'Web API',
      'ADO.NET',
      'MsSql',
      'Ninject',
      'NUnit',
      'Log4Net',
      'Git',
      'Swagger',
      'Automapper',
      'FluentValidation'
    ],
    repo: 'https://github.com/prowokatorkraft/My_Development_at_EPAM',
    petProjectId: 2
  }
];

const initialPetProjects: PetProject[] = [
  {
    id: 1,
    name: 'Task Manager API',
    year: '2024',
    description:
      'REST API для управления задачами с аутентификацией JWT, ролевой моделью и документацией Swagger.',
    techStack: ['NestJS', 'TypeORM', 'PostgreSQL', 'JWT', 'Swagger'],
    features: [
      'JWT аутентификация и авторизация',
      'Ролевая модель (Admin/User)',
      'CRUD операции с задачами',
      'Валидация данных',
      'Документация Swagger UI'
    ],
    repo: 'https://github.com/username/task-manager-api',
    demo: 'https://task-manager-api-demo.com'
  },
  {
    id: 2,
    name: 'Blog Platform',
    year: '2023',
    description:
      'Full-stack приложение для ведения блогов. Пользователи могут создавать посты, комментировать, ставить лайки.',
    techStack: ['NestJS', 'Vue 3', 'TypeORM', 'PostgreSQL', 'WebSockets'],
    features: [
      'Регистрация и авторизация',
      'Создание и редактирование постов',
      'Комментарии в реальном времени',
      'Система лайков',
      'Поиск по постам'
    ],
    repo: 'https://github.com/username/blog-platform',
    demo: 'https://blog-platform-demo.com'
  },
  {
    id: 3,
    name: 'Kanban Board (клон Trello)',
    year: '2023',
    description:
      'Drag-and-drop доска для управления задачами. Реальное время с WebSockets, сохранение состояния.',
    techStack: ['NestJS', 'Vue 3', 'Pinia', 'PostgreSQL', 'Socket.io'],
    features: [
      'Drag-and-drop задачи',
      'Колонки и задачи',
      'Обновления в реальном времени',
      'Сохранение состояния',
      'История действий'
    ],
    repo: 'https://github.com/username/kanban-clone',
    demo: 'https://kanban-clone-demo.com'
  },
  {
    id: 4,
    name: 'GitHub Analytics',
    year: '2024',
    description:
      'Приложение для анализа активности в GitHub репозиториях, статистика коммитов, графики.',
    techStack: ['NestJS', 'Vue 3', 'Chart.js', 'GitHub API', 'Redis'],
    features: [
      'Статистика коммитов',
      'Графики активности',
      'Кэширование Redis',
      'Анализ языков программирования',
      'Сравнение репозиториев'
    ],
    repo: 'https://github.com/username/github-analytics',
    demo: 'https://github-analytics-demo.com'
  }
];

export const useTrainingStore = defineStore('training', () => {
  const totalCourses = ref<number>(24);
  const githubUrl = ref<string>('https://github.com/username');
  const formalEducation = ref<FormalEducation[]>([...initialFormalEducation]);
  const certificates = ref<Certificate[]>([...initialCertificates]);
  const petProjects = ref<PetProject[]>([...initialPetProjects]);

  const totalCertificates = computed(() => certificates.value.length);
  const totalProjects = computed(() => petProjects.value.length);

  const totalLearningHours = computed(() => {
    return certificates.value.reduce((sum, cert) => sum + (cert.hours || 0), 0);
  });

  const certificatesByYearDesc = computed(() => {
    return [...certificates.value].sort((a, b) => parseInt(b.date) - parseInt(a.date));
  });

  const projectsByYear = computed(() => {
    const years: Record<string, PetProject[]> = {};
    petProjects.value.forEach((project) => {
      if (!years[project.year]) {
        years[project.year] = [];
      }
      years[project.year].push(project);
    });
    return years;
  });

  const uniqueTechStack = computed(() => {
    const techSet = new Set<string>();
    petProjects.value.forEach((project) => {
      project.techStack.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  });

  const getCertificatesByYear = (year: string) => {
    return computed(() => certificates.value.filter((cert) => cert.date === year));
  };

  const getProjectsByTech = (tech: string) => {
    return computed(() => petProjects.value.filter((project) => project.techStack.includes(tech)));
  };

  const getProjectsByYear = (year: string) => {
    return computed(() => petProjects.value.filter((project) => project.year === year));
  };

  const getCertificateById = (id: number) => {
    return computed(() => certificates.value.find((cert) => cert.id === id));
  };

  const getProjectById = (id: number) => {
    return computed(() => petProjects.value.find((project) => project.id === id));
  };

  function addCertificate(certificate: Certificate) {
    certificates.value.push(certificate);
  }

  function removeCertificate(id: number) {
    const index = certificates.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      certificates.value.splice(index, 1);
    }
  }

  function updateCertificate(id: number, updates: Partial<Certificate>) {
    const index = certificates.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      certificates.value[index] = { ...certificates.value[index], ...updates };
    }
  }

  function addProject(project: PetProject) {
    petProjects.value.push(project);
  }

  function removeProject(id: number) {
    const index = petProjects.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      petProjects.value.splice(index, 1);
    }
  }

  function updateProject(id: number, updates: Partial<PetProject>) {
    const index = petProjects.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      petProjects.value[index] = { ...petProjects.value[index], ...updates };
    }
  }

  function addFormalEducation(edu: FormalEducation) {
    formalEducation.value.push(edu);
  }

  function removeFormalEducation(id: number) {
    const index = formalEducation.value.findIndex((e) => e.id === id);
    if (index !== -1) {
      formalEducation.value.splice(index, 1);
    }
  }

  function setGithubUrl(url: string) {
    githubUrl.value = url;
  }

  function resetToInitial() {
    totalCourses.value = 24;
    githubUrl.value = 'https://github.com/username';
    formalEducation.value = [...initialFormalEducation];
    certificates.value = [...initialCertificates];
    petProjects.value = [...initialPetProjects];
  }

  async function fetchEducationData() {
    try {
      // const response = await api.get('/education')
      // formalEducation.value = response.data.education
      // certificates.value = response.data.certificates
      // petProjects.value = response.data.projects
    } catch (error) {
      console.error('Error fetching education data:', error);
    }
  }

  return {
    totalCourses,
    githubUrl,
    formalEducation,
    certificates,
    petProjects,

    totalCertificates,
    totalProjects,
    totalLearningHours,
    certificatesByYearDesc,
    projectsByYear,
    uniqueTechStack,

    getCertificatesByYear,
    getProjectsByTech,
    getProjectsByYear,
    getCertificateById,
    getProjectById,

    addCertificate,
    removeCertificate,
    updateCertificate,
    addProject,
    removeProject,
    updateProject,
    addFormalEducation,
    removeFormalEducation,
    setGithubUrl,
    resetToInitial,
    fetchEducationData
  };
});
