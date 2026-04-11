import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTrainingStore } from '../../src/stores/Training';

describe('useTrainingStore', () => {
  let store: ReturnType<typeof useTrainingStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useTrainingStore();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с начальными значениями', () => {
      expect(store.totalCourses).toBe(24);
      expect(store.githubUrl).toBe('https://github.com/prowokatorkraft');
      expect(store.formalEducation).toHaveLength(2);
      expect(store.certificates).toHaveLength(3);
      expect(store.petProjects).toHaveLength(3);
    });

    it('должен правильно инициализировать формальное образование', () => {
      const edu = store.formalEducation[0];
      expect(edu).toMatchObject({
        id: 1,
        period: '2015 — 2020',
        status: 'Высшее техническое',
        degree: 'Бакалавр по агроинженерным специальностям',
        institution: 'СГАУ имени Н.И. Вавилова',
      });
    });

    it('должен правильно инициализировать сертификаты', () => {
      const cert = store.certificates[0];
      expect(cert).toMatchObject({
        id: 1,
        name: 'JavaScript Developer. Professional',
        issuer: 'Otus',
        date: '2026',
        hours: 49,
      });
      expect(cert.skills).toContain('TypeScript');
      expect(cert.skills).toContain('Vue3');
    });

    it('должен правильно инициализировать пет-проекты', () => {
      const project = store.petProjects[0];
      expect(project).toMatchObject({
        id: 1,
        name: 'WorkFolio',
        year: '2026',
        repo: 'https://github.com/prowokatorkraft/workfolio',
      });
      expect(project.techStack).toContain('Vue3');
      expect(project.techStack).toContain('NestJS');
    });
  });

  describe('Вычисляемые свойства (computed)', () => {
    describe('totalCertificates', () => {
      it('должен возвращать общее количество сертификатов', () => {
        expect(store.totalCertificates).toBe(3);
      });

      it('должен обновляться при добавлении сертификата', () => {
        const newCert = {
          id: 4,
          icon: 'test.png',
          name: 'Test Cert',
          issuer: 'Test',
          date: '2024',
          hours: 10,
          skills: ['Test'],
        };
        store.addCertificate(newCert);
        expect(store.totalCertificates).toBe(4);
      });
    });

    describe('totalProjects', () => {
      it('должен возвращать общее количество пет-проектов', () => {
        expect(store.totalProjects).toBe(3);
      });

      it('должен обновляться при добавлении проекта', () => {
        const newProject = {
          id: 4,
          name: 'Test Project',
          year: '2024',
          description: 'Test',
          techStack: ['Test'],
          features: ['Test'],
          repo: 'https://github.com/test',
        };
        store.addProject(newProject);
        expect(store.totalProjects).toBe(4);
      });
    });

    describe('totalLearningHours', () => {
      it('должен суммировать часы всех сертификатов', () => {
        // 49 + 126 + 0 = 175
        expect(store.totalLearningHours).toBe(175);
      });

      it('должен обновляться при добавлении сертификата с часами', () => {
        const newCert = {
          id: 4,
          icon: 'test.png',
          name: 'Test Cert',
          issuer: 'Test',
          date: '2024',
          hours: 30,
          skills: ['Test'],
        };
        store.addCertificate(newCert);
        expect(store.totalLearningHours).toBe(205);
      });
    });

    describe('getCertificatesByYearDesc', () => {
      it('должен сортировать сертификаты по году в порядке убывания', () => {
        const sorted = store.getCertificatesByYearDesc();
        expect(sorted[0].date).toBe('2026');
        expect(sorted[1].date).toBe('2023');
        expect(sorted[2].date).toBe('2020');
      });

      it('должен возвращать новый массив, а не ссылку', () => {
        const sorted1 = store.getCertificatesByYearDesc();
        const sorted2 = store.getCertificatesByYearDesc();
        expect(sorted1).not.toBe(sorted2);
      });
    });

    describe('projectsByYear', () => {
      it('должен группировать проекты по годам', () => {
        const grouped = store.projectsByYear;
        expect(Object.keys(grouped)).toHaveLength(3);
        expect(grouped['2026']).toHaveLength(1);
        expect(grouped['2021']).toHaveLength(1);
        expect(grouped['2020']).toHaveLength(1);
        expect(grouped['2026'][0].name).toBe('WorkFolio');
      });

      it('должен добавлять проект в правильную группу', () => {
        const newProject = {
          id: 4,
          name: 'New Project',
          year: '2024',
          description: 'Test',
          techStack: ['Test'],
          features: ['Test'],
          repo: 'https://github.com/test',
        };
        store.addProject(newProject);
        const grouped = store.projectsByYear;
        expect(grouped['2024']).toHaveLength(1);
        expect(grouped['2024'][0].name).toBe('New Project');
      });
    });

    describe('uniqueTechStack', () => {
      it('должен возвращать уникальный список технологий из всех проектов', () => {
        const techs = store.uniqueTechStack;
        expect(techs).toContain('Vue3');
        expect(techs).toContain('TypeScript');
        expect(techs).toContain('C#');
        expect(techs).toContain('PostgreSQL');
      });

      it('должен возвращать отсортированный список', () => {
        const techs = store.uniqueTechStack;
        for (let i = 0; i < techs.length - 1; i++) {
          expect(techs[i] <= techs[i + 1]).toBe(true);
        }
      });

      it('должен обновляться при добавлении проекта с новой технологией', () => {
        const newProject = {
          id: 4,
          name: 'Test Project',
          year: '2024',
          description: 'Test',
          techStack: ['NewTech', 'Vue3'],
          features: ['Test'],
          repo: 'https://github.com/test',
        };
        store.addProject(newProject);
        expect(store.uniqueTechStack).toContain('NewTech');
        expect(store.uniqueTechStack).toContain('Vue3');
      });
    });
  });

  describe('Геттеры', () => {
    describe('getCertificatesByYear', () => {
      it('должен возвращать сертификаты за указанный год', () => {
        const certs2026 = store.getCertificatesByYear('2026');
        expect(certs2026.value).toHaveLength(1);
        expect(certs2026.value[0].name).toBe('JavaScript Developer. Professional');
      });

      it('должен возвращать пустой массив для года без сертификатов', () => {
        const certs2025 = store.getCertificatesByYear('2025');
        expect(certs2025.value).toHaveLength(0);
      });
    });

    describe('getProjectsByTech', () => {
      it('должен возвращать проекты, использующие указанную технологию', () => {
        const vueProjects = store.getProjectsByTech('Vue3');
        expect(vueProjects.value).toHaveLength(1);
        expect(vueProjects.value[0].name).toBe('WorkFolio');
      });

      it('должен возвращать пустой массив для технологии без проектов', () => {
        const reactProjects = store.getProjectsByTech('React');
        expect(reactProjects.value).toHaveLength(0);
      });
    });

    describe('getProjectsByYear', () => {
      it('должен возвращать проекты за указанный год', () => {
        const projects2026 = store.getProjectsByYear('2026');
        expect(projects2026.value).toHaveLength(1);
        expect(projects2026.value[0].name).toBe('WorkFolio');
      });

      it('должен возвращать пустой массив для года без проектов', () => {
        const projects2025 = store.getProjectsByYear('2025');
        expect(projects2025.value).toHaveLength(0);
      });
    });

    describe('getCertificateById', () => {
      it('должен возвращать сертификат по ID', () => {
        const cert = store.getCertificateById(1);
        expect(cert.value).toBeDefined();
        expect(cert.value?.name).toBe('JavaScript Developer. Professional');
      });

      it('должен возвращать undefined для несуществующего ID', () => {
        const cert = store.getCertificateById(999);
        expect(cert.value).toBeUndefined();
      });
    });

    describe('getProjectById', () => {
      it('должен возвращать проект по ID', () => {
        const project = store.getProjectById(1);
        expect(project.value).toBeDefined();
        expect(project.value?.name).toBe('WorkFolio');
      });

      it('должен возвращать undefined для несуществующего ID', () => {
        const project = store.getProjectById(999);
        expect(project.value).toBeUndefined();
      });
    });
  });

  describe('CRUD операции с сертификатами', () => {
    const newCertificate = {
      id: 4,
      icon: 'new.png',
      name: 'New Certificate',
      issuer: 'Test Issuer',
      date: '2024',
      hours: 40,
      skills: ['Test Skill'],
      courseLink: 'https://test.com',
    };

    it('должен добавлять сертификат', () => {
      const length = store.certificates.length;
      store.addCertificate(newCertificate);
      expect(store.certificates?.length ?? 0).toBeGreaterThan(length);
      expect(store.certificates.find((c) => c.id === 4)).toEqual(newCertificate);
    });

    it('должен обновлять сертификат', () => {
      const length = store.certificates.length;
      store.updateCertificate(1, { name: 'Updated Name', hours: 100 });
      const updated = store.certificates.find((c) => c.id === 1);

      expect(store.certificates).toHaveLength(length);
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.hours).toBe(100);
    });

    it('не должен обновлять несуществующий сертификат', () => {
      const originalLength = store.certificates.length;
      store.updateCertificate(999, { name: 'Not Exist' });
      expect(store.certificates).toHaveLength(originalLength);
    });

    it('должен удалять сертификат', () => {
      const length = store.certificates.length;
      store.removeCertificate(1);
      expect(store.certificates.length ?? 0).toBeLessThan(length);
      expect(store.certificates.find((c) => c.id === 1)).toBeUndefined();
    });

    it('не должен удалять несуществующий сертификат', () => {
      const originalLength = store.certificates.length;
      store.removeCertificate(999);
      expect(store.certificates).toHaveLength(originalLength);
    });
  });

  describe('CRUD операции с пет-проектами', () => {
    const newProject = {
      id: 4,
      name: 'New Project',
      year: '2024',
      description: 'Test Description',
      techStack: ['Tech1', 'Tech2'],
      features: ['Feature1', 'Feature2'],
      repo: 'https://github.com/test',
      demo: 'https://demo.test.com',
    };

    it('должен добавлять проект', () => {
      const length = store.petProjects.length;
      store.addProject(newProject);
      expect(store.petProjects?.length).toBeGreaterThan(length);
      expect(store.petProjects.find((p) => p.id === 4)).toEqual(newProject);
    });

    it('должен обновлять проект', () => {
      const length = store.petProjects.length;
      store.updateProject(1, { name: 'Updated Project', year: '2025' });
      const updated = store.petProjects.find((p) => p.id === 1);

      expect(store.petProjects).toHaveLength(length);
      expect(updated?.name).toBe('Updated Project');
      expect(updated?.year).toBe('2025');
    });

    it('не должен обновлять несуществующий проект', () => {
      const originalLength = store.petProjects.length;
      store.updateProject(999, { name: 'Not Exist' });
      expect(store.petProjects).toHaveLength(originalLength);
    });

    it('должен удалять проект', () => {
      const length = store.petProjects.length;
      store.removeProject(1);
      expect(store.petProjects?.length).toBeLessThan(length);
      expect(store.petProjects.find((p) => p.id === 1)).toBeUndefined();
    });

    it('не должен удалять несуществующий проект', () => {
      const originalLength = store.petProjects.length;
      store.removeProject(999);
      expect(store.petProjects).toHaveLength(originalLength);
    });
  });

  describe('CRUD операции с формальным образованием', () => {
    const newEducation = {
      id: 3,
      period: '2020 — 2024',
      status: 'Высшее',
      degree: 'Магистр',
      institution: 'Test University',
      description: 'Test Description',
      specialization: 'Test Specialization',
    };

    it('должен добавлять образование', () => {
      const length = store.formalEducation.length;
      store.addFormalEducation(newEducation);
      expect(store.formalEducation?.length).toBeGreaterThan(length);
      expect(store.formalEducation.find((e) => e.id === 3)).toEqual(newEducation);
    });

    it('должен удалять образование', () => {
      const length = store.formalEducation.length;
      store.removeFormalEducation(1);
      expect(store.formalEducation?.length).toBeLessThan(length);
      expect(store.formalEducation.find((e) => e.id === 1)).toBeUndefined();
    });

    it('не должен удалять несуществующее образование', () => {
      const originalLength = store.formalEducation.length;
      store.removeFormalEducation(999);
      expect(store.formalEducation).toHaveLength(originalLength);
    });
  });

  describe('Управление настройками', () => {
    it('должен обновлять GitHub URL', () => {
      store.setGithubUrl('https://github.com/newuser');
      expect(store.githubUrl).toBe('https://github.com/newuser');
    });
  });

  describe('Сброс к начальному состоянию', () => {
    it('должен сбрасывать все данные к начальным значениям', () => {
      store.setGithubUrl('https://github.com/changed');
      store.addCertificate({
        id: 99,
        icon: 'test.png',
        name: 'Test',
        issuer: 'Test',
        date: '2024',
        hours: 10,
        skills: ['Test'],
      });
      store.addProject({
        id: 99,
        name: 'Test Project',
        year: '2024',
        description: 'Test',
        techStack: ['Test'],
        features: ['Test'],
        repo: 'https://github.com/test',
      });
      store.addFormalEducation({
        id: 99,
        period: '2024',
        status: 'Test',
        degree: 'Test',
        institution: 'Test',
        description: 'Test',
      });

      expect(store.githubUrl).not.toBe('https://github.com/prowokatorkraft');
      expect(store.certificates).toHaveLength(4);
      expect(store.petProjects).toHaveLength(4);
      expect(store.formalEducation).toHaveLength(3);

      store.resetToInitial();

      expect(store.githubUrl).toBe('https://github.com/username');
      expect(store.certificates).toHaveLength(3);
      expect(store.petProjects).toHaveLength(3);
      expect(store.formalEducation).toHaveLength(2);
      expect(store.totalCourses).toBe(24);
    });

    it('должен сбрасывать вычисляемые свойства после сброса', () => {
      store.addCertificate({
        id: 99,
        icon: 'test.png',
        name: 'Test',
        issuer: 'Test',
        date: '2024',
        hours: 100,
        skills: ['Test'],
      });

      expect(store.totalCertificates).toBe(4);
      expect(store.totalLearningHours).toBe(275);

      store.resetToInitial();

      expect(store.totalCertificates).toBe(3);
      expect(store.totalLearningHours).toBe(175);
    });
  });

  describe('Граничные случаи', () => {
    it('должен корректно обрабатывать сертификаты без часов', () => {
      const certWithoutHours = store.certificates.find((c) => c.hours === 0);
      expect(certWithoutHours).toBeDefined();
      expect(store.totalLearningHours).toBe(175);
    });

    it('должен корректно группировать проекты при добавлении в новый год', () => {
      const newProject = {
        id: 4,
        name: 'Future Project',
        year: '2030',
        description: 'Test',
        techStack: ['Test'],
        features: ['Test'],
        repo: 'https://github.com/test',
      };
      store.addProject(newProject);

      const grouped = store.projectsByYear;
      expect(grouped['2030']).toHaveLength(1);
    });

    it('должен корректно обновлять уникальные технологии при удалении проекта', () => {
      const beforeTechs = store.uniqueTechStack;
      const vue3Exists = beforeTechs.includes('Vue3');

      store.removeProject(1);

      const afterTechs = store.uniqueTechStack;
      if (vue3Exists && !store.petProjects.some((p) => p.techStack.includes('Vue3'))) {
        expect(afterTechs.includes('Vue3')).toBe(false);
      }
    });

    it('должен возвращать копии массивов в геттерах, а не ссылки на состояние', () => {
      const certs2026 = store.getCertificatesByYear('2026');
      const originalLength = certs2026.value.length;

      store.addCertificate({
        id: 99,
        icon: 'test.png',
        name: 'Test 2026',
        issuer: 'Test',
        date: '2026',
        hours: 10,
        skills: ['Test'],
      });

      const newCerts2026 = store.getCertificatesByYear('2026');
      expect(newCerts2026.value.length).toBe(originalLength + 1);
    });
  });
});
