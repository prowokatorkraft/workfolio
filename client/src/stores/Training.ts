import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Certificate } from '../types/Certificate.ts';
import type { PetProject } from '../types/PetProject.ts';
import type { FormalEducation } from '../types/FormalEducation.ts';

const initialFormalEducation: FormalEducation[] = [
  {
    id: 1,
    period: '2015 — 2020',
    status: 'Высшее техническое',
    degree: 'Бакалавр по агроинженерным специальностям',
    institution: 'СГАУ имени Н.И. Вавилова',
    description: 'Фундаментальная подготовка в области электрооборудования и электротехнологий.'
  },
  {
    id: 2,
    period: '2010 — 2013',
    status: 'Начальное профессиональное',
    degree: 'Специалист по информационным системам',
    institution: 'Профессиональное училище',
    description: 'Начальная подготовка в области информационных технологий.',
    specialization: 'Оператор электронно-вычислительных и вычислительных машин 3 разряда'
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
      'C#',
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
    name: 'WorkFolio',
    year: '2026',
    description:
      'Портфолио, отражающее профессиональный опыт и навыки пользователя, с функцией аналитики посещаемости и активности на платформе.',
    techStack: [
      'TypeScript',
      'Vue3',
      'Pinia',
      'Vue router',
      'Vite',
      'ESLint/Prettier',
      'Jest/Vitest',
      'NestJS',
      'TypeORM',
      'PostgreSQL'
    ],
    features: [
      'Адаптивный интерфейс',
      'Бейджи с уровнем владения технологией',
      'Гиппер-ссылки на страницах',
      'Логирование событий и их аналитика'
    ],
    repo: 'https://github.com/prowokatorkraft/workfolio',
    demo: 'https://workfolio-fe.vercel.app/'
  },
  {
    id: 2,
    name: 'Library',
    year: '2021',
    description: 'Библиотека книг и газет с использованием авторских прав.',
    techStack: [
      'C#',
      '.NET Framework',
      'ASP.NET',
      'HTML',
      'CSS',
      'JavaScript',
      'AJAX',
      'Razor',
      'MVC',
      'Web API',
      'ADO.NET',
      'MS SQL',
      'Log4Net',
      'Ninject',
      'NUnit',
      'Git'
    ],
    features: [
      'Трехзвенное приложение',
      'Реализована аутентификация и авторизация пользователя',
      'Реализован веб-интерфейс с помощью MVC и Web API',
      'Покрыто Unit и интеграционным тестированием',
      'Развернута база данных'
    ],
    repo: 'https://github.com/prowokatorkraft/RDRUNET'
  },
  {
    id: 3,
    name: 'Internet Store',
    year: '2020',
    description:
      'Проект интернет‑магазина в качестве итоговой курсовой работы, иллюстрирующей приобретённые знания и умения',
    techStack: [
      'C#',
      '.NET Framework',
      'ASP.NET',
      'HTML',
      'CSS',
      'JavaScript',
      'AJAX',
      'Razor',
      'ADO.NET',
      'MS SQL',
      'Log4Net',
      'Git'
    ],
    features: [
      'Трехзвенное приложение',
      'Реализован функционал логирования с использованием библиотеки log4net',
      'Разработана клиентская часть с использованием HTML, CSS и JavaScript',
      'Развернута база данных'
    ],
    repo: 'https://github.com/prowokatorkraft/My_Development_at_EPAM/tree/master/Internet_shop'
  }
];

export const useTrainingStore = defineStore('training', () => {
  const totalCourses = ref<number>(24);
  const githubUrl = ref<string>('https://github.com/prowokatorkraft');
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
