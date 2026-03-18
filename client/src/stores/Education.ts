import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface FormalEducation {
  id: number;
  period: string;
  status: string;
  degree: string;
  institution: string;
  description: string;
  specialization?: string;
}

interface Certificate {
  id: number;
  icon: string;
  name: string;
  issuer: string;
  date: string;
  hours?: number;
  credentialId?: string;
  skills: string[];
  link: string;
}

interface PetProject {
  id: number;
  name: string;
  year: string;
  description: string;
  techStack: string[];
  features?: string[];
  repo: string;
  demo?: string;
}

const initialFormalEducation: FormalEducation[] = [
  {
    id: 1,
    period: '2018 — 2023',
    status: 'Диплом с отличием',
    degree: 'Магистр прикладной математики и информатики',
    institution: 'СГАУ, Агроинженерия',
    description:
      'Фундаментальная подготовка в области математического моделирования и разработки программного обеспечения.',
    specialization: 'Математическое моделирование и программная инженерия',
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
    icon: '📘',
    name: 'NestJS: Современная серверная разработка',
    issuer: 'Udemy',
    date: '2024',
    hours: 42,
    credentialId: 'UC-1234-5678',
    skills: ['NestJS', 'TypeORM', 'PostgreSQL', 'JWT', 'WebSockets'],
    link: '#'
  },
  {
    id: 2,
    icon: '📗',
    name: 'TypeORM - Работа с базами данных',
    issuer: 'Stepik',
    date: '2023',
    hours: 36,
    credentialId: 'ST-9876-5432',
    skills: ['TypeORM', 'SQL', 'PostgreSQL', 'MongoDB', 'Relations'],
    link: '#'
  },
  {
    id: 3,
    icon: '📕',
    name: 'PostgreSQL для профессионалов',
    issuer: 'Coursera',
    date: '2023',
    hours: 48,
    credentialId: 'CR-5678-1234',
    skills: ['PostgreSQL', 'SQL', 'Query Optimization', 'Indexes', 'Transactions'],
    link: '#'
  },
  {
    id: 4,
    icon: '📙',
    name: 'JavaScript / TypeScript: Продвинутый уровень',
    issuer: 'HTML Academy',
    date: '2022',
    hours: 60,
    credentialId: 'HA-4321-8765',
    skills: ['JavaScript', 'TypeScript', 'OOP', 'Generics', 'Decorators'],
    link: '#'
  },
  {
    id: 5,
    icon: '🇬🇧',
    name: 'Английский язык для IT-специалистов',
    issuer: 'Skyeng',
    date: '2023',
    hours: 72,
    credentialId: 'SE-2468-1357',
    skills: ['Technical English', 'IT Terminology', 'Business English'],
    link: '#'
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

export const useEducationStore = defineStore('education', () => {
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
