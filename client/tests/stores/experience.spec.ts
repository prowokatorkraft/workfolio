import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useExperienceStore } from '../../src/stores/Experience';
import { TechnologyGroup } from '../../src/types/Technology';

vi.mock('../../src/lib/tools', () => ({
  formatDuration: vi.fn(),
  parsePeriod: vi.fn(),
  clone: vi.fn((obj) => JSON.parse(JSON.stringify(obj))),
}));

import { formatDuration, parsePeriod } from '../../src/lib/tools';

describe('useExperienceStore', () => {
  let store: ReturnType<typeof useExperienceStore>;

  beforeEach(() => {
    type MockFunction = ReturnType<typeof vi.fn>;
    const mockedFormatDuration = formatDuration as unknown as MockFunction;
    const mockedParsePeriod = parsePeriod as unknown as MockFunction;

    mockedFormatDuration.mockImplementation((months: string) => `${months} мес.`);
    mockedParsePeriod.mockImplementation((start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = end ? new Date(end) : new Date();
      const durationMonths =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      return {
        period: `${startDate.getUTCFullYear()} — ${endDate.getUTCFullYear()}`,
        durationMonths,
      };
    });

    setActivePinia(createPinia());
    store = useExperienceStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const getRef = (value: unknown) => {
    return { value: value };
  };

  describe('Инициализация', () => {
    it('должен инициализироваться с начальными технологиями', () => {
      expect(store.technology[0]).toMatchObject({
        id: 1,
        name: 'Vue.js',
        level: 50,
        group: TechnologyGroup.frontend,
      });
    });

    it('должен инициализироваться с начальными проектами', () => {
      expect(store.projects).toHaveLength(3);
      expect(store.projects[0]).toMatchObject({
        id: 1,
        title: 'Комплекс расчетов оценки стоимости строительства 2.0',
        company: 'Газпром ЦПС',
      });
    });

    it('все проекты должны быть свёрнуты при инициализации', () => {
      store.projects.forEach((project) => {
        expect(project.isExpanded).toBe(false);
      });
    });
  });

  describe('getTechnologyByGroup', () => {
    it('должен возвращать технологии для frontend группы', () => {
      const frontendTechs = store.getTechnologyByGroup(TechnologyGroup.frontend);
      expect(frontendTechs.value.length).toBeGreaterThan(0);
      expect(frontendTechs.value.map((t) => t.name)).toContain('Vue.js');
      expect(frontendTechs.value.map((t) => t.name)).toContain('React');
    });

    it('должен возвращать технологии для backend группы', () => {
      const backendTechs = store.getTechnologyByGroup(TechnologyGroup.backend);
      expect(backendTechs.value.length).toBeGreaterThan(0);
      expect(backendTechs.value.map((t) => t.name)).toContain('Node.js');
      expect(backendTechs.value.map((t) => t.name)).toContain('C#');
    });

    it('должен возвращать технологии для data группы', () => {
      const dataTechs = store.getTechnologyByGroup(TechnologyGroup.data);
      expect(dataTechs.value.length).toBeGreaterThan(0);
      expect(dataTechs.value.map((t) => t.name)).toContain('PostgreSQL');
      expect(dataTechs.value.map((t) => t.name)).toContain('MSSQL');
    });
  });

  describe('getTechnologyByIds', () => {
    it('должен возвращать технологии по списку ID', () => {
      const techs = store.getTechnologyByIds([1, 2, 3]);
      expect(techs.value).toHaveLength(3);
      expect(techs.value[0].name).toBe('Vue.js');
      expect(techs.value[1].name).toBe('React');
      expect(techs.value[2].name).toBe('TypeScript');
    });

    it('должен игнорировать несуществующие ID', () => {
      const techs = store.getTechnologyByIds([1, 999, 2]);
      expect(techs.value).toHaveLength(2);
      expect(techs.value[0].name).toBe('Vue.js');
      expect(techs.value[1].name).toBe('React');
    });

    it('должен возвращать пустой массив для пустого списка ID', () => {
      const techs = store.getTechnologyByIds([]);
      expect(techs.value).toEqual([]);
    });
  });

  describe('getProjectPeriod', () => {
    it('должен возвращать период проекта по ID', () => {
      const period = store.getProjectPeriod(1);
      expect(period.value).toBe('2024 — ' + new Date().getUTCFullYear());
    });

    it('должен возвращать период для завершённого проекта', () => {
      const period = store.getProjectPeriod(2);
      expect(period.value).toBe('2022 — 2024');
    });

    it('должен возвращать пустую строку для несуществующего проекта', () => {
      const period = store.getProjectPeriod(999);
      expect(period.value).toBe('');
    });
  });

  describe('duration (общий стаж)', () => {
    it('должен рассчитывать общую длительность всех проектов', () => {
      expect(store.duration).toBeDefined();
      getRef(store.duration);
      expect(formatDuration).toHaveBeenCalled();
    });
  });

  describe('CRUD операции с технологиями', () => {
    it('должен добавлять новую технологию', () => {
      const originalLength = store.technology.length;
      const newTech = {
        id: 100,
        name: 'Tailwind',
        level: 70,
        group: TechnologyGroup.frontend,
      };

      store.addTechnology(newTech);

      expect(store.technology?.length ?? 0).toBeGreaterThan(originalLength);
      expect(store.technology.find((t) => t.id === 100)).toEqual(newTech);
    });

    it('должен обновлять существующую технологию', () => {
      const originalLength = store.technology.length;
      store.updateTechnology(1, { level: 90, name: 'Vue 3' });

      const updated = store.technology.find((t) => t.id === 1);

      expect(store.technology).toHaveLength(originalLength);
      expect(updated?.level).toBe(90);
      expect(updated?.name).toBe('Vue 3');
    });

    it('не должен обновлять несуществующую технологию', () => {
      const originalLength = store.technology.length;
      store.updateTechnology(999, { level: 100 });

      expect(store.technology).toHaveLength(originalLength);
    });

    it('должен удалять технологию', () => {
      const length = store.technology.length;

      store.removeTechnology(1);

      expect(store.technology?.length ?? 0).toBeLessThan(length);
      expect(store.technology.find((t) => t.id === 1)).toBeUndefined();
    });

    it('не должен удалять несуществующую технологию', () => {
      const originalLength = store.technology.length;
      store.removeTechnology(999);

      expect(store.technology).toHaveLength(originalLength);
    });
  });

  describe('CRUD операции с проектами', () => {
    const newProject = {
      id: 100,
      periodStart: '2024-01-01',
      title: 'Новый проект',
      company: 'Новая компания',
      shortDescription: 'Описание',
      detailedDescription: 'Детальное описание',
      technologyIds: [1, 2],
      achievements: ['Достижение 1'],
      isExpanded: false,
    };

    it('должен добавлять новый проект', () => {
      const originalLength = store.projects.length;
      store.addProject(newProject);

      expect(store.projects.length ?? 0).toBeGreaterThan(originalLength);
      expect(store.projects.find((p) => p.id === 100)).toEqual(newProject);
    });

    it('должен обновлять существующий проект', () => {
      const originalLength = store.projects.length;
      store.updateProject(1, { title: 'Обновлённый проект', company: 'Новый Газпром' });

      const updated = store.projects.find((p) => p.id === 1);

      expect(store.projects).toHaveLength(originalLength);
      expect(updated?.title).toBe('Обновлённый проект');
      expect(updated?.company).toBe('Новый Газпром');
    });

    it('не должен обновлять несуществующий проект', () => {
      const originalProjects = [...store.projects];
      const originalLength = store.projects.length;
      store.updateProject(999, { title: 'Не существует' });

      expect(store.projects).toHaveLength(originalLength);
      expect(store.projects).toEqual(originalProjects);
    });

    it('должен удалять проект', () => {
      const originalLength = store.projects.length;
      store.removeProject(1);

      expect(store.projects.length ?? 0).toBeLessThan(originalLength);
      expect(store.projects.find((p) => p.id === 1)).toBeUndefined();
    });
  });

  describe('Управление состоянием раскрытия проектов', () => {
    it('должен переключать состояние проекта', () => {
      expect(store.projects[0].isExpanded).toBe(false);

      store.toggleProject(1);
      expect(store.projects[0].isExpanded).toBe(true);

      store.toggleProject(1);
      expect(store.projects[0].isExpanded).toBe(false);
    });

    it('должен раскрывать конкретный проект', () => {
      store.expandProject(1);
      expect(store.projects[0].isExpanded).toBe(true);
      expect(store.projects[1].isExpanded).toBe(false);
    });

    it('должен сворачивать конкретный проект', () => {
      store.expandProject(1);
      expect(store.projects[0].isExpanded).toBe(true);

      store.collapseProject(1);
      expect(store.projects[0].isExpanded).toBe(false);
    });

    it('должен раскрывать все проекты', () => {
      store.expandAllProjects();

      store.projects.forEach((project) => {
        expect(project.isExpanded).toBe(true);
      });
    });

    it('должен сворачивать все проекты', () => {
      store.expandAllProjects();
      expect(store.projects[0].isExpanded).toBe(true);

      store.collapseAllProjects();
      store.projects.forEach((project) => {
        expect(project.isExpanded).toBe(false);
      });
    });
  });

  describe('Сброс к начальному состоянию', () => {
    it('должен сбрасывать технологии к начальным', () => {
      const originalLength = store.technology.length;
      store.addTechnology({ id: 999, name: 'Test', level: 100, group: TechnologyGroup.frontend });
      expect(store.technology.length ?? 0).toBeGreaterThan(originalLength);

      store.resetToInitial();
      expect(store.technology).toHaveLength(originalLength);
      expect(store.technology.find((t) => t.id === 999)).toBeUndefined();
    });

    it('должен сбрасывать проекты к начальным', () => {
      store.addProject({
        id: 999,
        periodStart: '2024-01-01',
        title: 'Test',
        company: 'Test',
        shortDescription: '',
        detailedDescription: '',
        technologyIds: [],
        achievements: [],
        isExpanded: false,
      });
      expect(store.projects).toHaveLength(4);

      store.resetToInitial();
      expect(store.projects).toHaveLength(3);
      expect(store.projects.find((p) => p.id === 999)).toBeUndefined();
    });

    it('должен сбрасывать состояние раскрытия проектов', () => {
      store.expandAllProjects();
      expect(store.projects[0].isExpanded).toBe(true);

      store.resetToInitial();
      store.projects.forEach((project) => {
        expect(project.isExpanded).toBe(false);
      });
    });
  });

  describe('Граничные случаи', () => {
    it('должен корректно обрабатывать undefined в parsePeriod', () => {
      const period = store.getProjectPeriod(1);
      expect(period.value).toBeDefined();
    });

    it('должен возвращать корректные технологии даже после удаления', () => {
      const techsBefore = store.getTechnologyByIds([1, 2]);
      expect(techsBefore.value).toHaveLength(2);

      store.removeTechnology(1);

      const techsAfter = store.getTechnologyByIds([1, 2]);
      expect(techsAfter.value).toHaveLength(1);
      expect(techsAfter.value[0].id).toBe(2);
    });

    it('должен корректно обновлять несколько полей технологии', () => {
      store.updateTechnology(1, {
        level: 95,
        name: 'Vue.js Master',
        group: TechnologyGroup.frontend,
      });

      const updated = store.technology.find((t) => t.id === 1);
      expect(updated).toMatchObject({
        id: 1,
        name: 'Vue.js Master',
        level: 95,
        group: TechnologyGroup.frontend,
      });
    });
  });
});
