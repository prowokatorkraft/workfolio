/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import axios from 'axios';
import { useApi } from '../../src/composables/useApi';

const mockOrigin = 'http://localhost:3000';
Object.defineProperty(window, 'location', {
  value: { origin: mockOrigin },
  writable: true,
});

const { mockAxiosInstance } = vi.hoisted(() => ({
  mockAxiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
    isAxiosError: vi.fn(),
  },
}));

describe('useApi', () => {
  const mockData = { id: 1, name: 'Test' };
  const mockResponse = { data: mockData };

  beforeEach(() => {
    vi.clearAllMocks();
    (axios.isAxiosError as unknown as Mock).mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с переданным значением', () => {
      const defaultValue = { items: [] };
      const { data, loading, error } = useApi(defaultValue);

      expect(data.value).toEqual(defaultValue);
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('должен инициализироваться с примитивным значением', () => {
      const { data, loading, error } = useApi(0);

      expect(data.value).toBe(0);
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('должен инициализироваться со строкой', () => {
      const { data, loading, error } = useApi('');

      expect(data.value).toBe('');
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('должен инициализироваться с массивом', () => {
      const defaultValue = [1, 2, 3];
      const { data, loading, error } = useApi(defaultValue);

      expect(data.value).toEqual(defaultValue);
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('должен инициализироваться с null', () => {
      const { data, loading, error } = useApi(null);

      expect(data.value).toBeNull();
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });
  });

  describe('GET запросы', () => {
    it('должен успешно выполнять GET запрос и обновлять data', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const { data, loading, error, get } = useApi(null);
      const params = { id: 1 };

      const promise = get('test', params);

      expect(loading.value).toBe(true);
      expect(error.value).toBeNull();

      await promise;

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('http://localhost:3000/api/test', {
        params,
      });
      expect(data.value).toEqual(mockData);
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('должен выполнять GET запрос без параметров', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const { get } = useApi(null);

      await get('test', undefined);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('http://localhost:3000/api/test', {
        params: undefined,
      });
    });

    it('должен обрабатывать ошибку при GET запросе', async () => {
      const errorMessage = 'Network Error';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      const { data, loading, error, get } = useApi(null);

      await get('test', {});

      expect(data.value).toBeNull();
      expect(loading.value).toBe(false);
      expect(error.value).toBe(errorMessage);
    });

    it('должен обрабатывать Axios ошибку с response', async () => {
      const axiosError = new Error('Request failed');
      Object.assign(axiosError, {
        isAxiosError: true,
        response: { data: { message: 'Server error' } },
      });

      mockAxiosInstance.get.mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);

      const { error, get } = useApi(null);

      await get('test', {});

      expect(error.value).toBe('Server error');
    });

    it('должен обрабатывать Axios ошибку без response', async () => {
      const axiosError = new Error('Network Error');
      Object.assign(axiosError, {
        isAxiosError: true,
        message: 'Network Error',
      });

      mockAxiosInstance.get.mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);

      const { error, get } = useApi(null);

      await get('test', {});

      expect(error.value).toBe('Network Error');
    });

    it('должен обрабатывать неизвестную ошибку', async () => {
      mockAxiosInstance.get.mockRejectedValue({});

      const { error, get } = useApi(null);

      await get('test', {});

      expect(error.value).toBe('Unknown error occurred');
    });
  });

  describe('POST запросы', () => {
    it('должен успешно выполнять POST запрос и обновлять data', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const { data, loading, error, post } = useApi(null);
      const params = { name: 'New Item' };

      const promise = post('test', params);

      expect(loading.value).toBe(true);
      expect(error.value).toBeNull();

      await promise;

      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/test',
        params
      );
      expect(data.value).toEqual(mockData);
      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('должен выполнять POST запрос без параметров', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const { post } = useApi(null);

      await post('test', undefined);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/test',
        undefined
      );
    });

    it('должен обрабатывать ошибку при POST запросе', async () => {
      const errorMessage = 'Creation failed';
      mockAxiosInstance.post.mockRejectedValue(new Error(errorMessage));

      const { data, loading, error, post } = useApi(null);

      await post('test', {});

      expect(data.value).toBeNull();
      expect(loading.value).toBe(false);
      expect(error.value).toBe(errorMessage);
    });

    it('должен обрабатывать Axios ошибку при POST', async () => {
      const axiosError = new Error('Validation error');
      Object.assign(axiosError, {
        isAxiosError: true,
        response: { data: { message: 'Validation error' } },
      });

      mockAxiosInstance.post.mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);

      const { error, post } = useApi(null);

      await post('test', {});

      expect(error.value).toBe('Validation error');
    });
  });

  describe('Состояние загрузки', () => {
    it('должен устанавливать loading в true во время запроса и false после', async () => {
      let resolvePromise: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockAxiosInstance.get.mockReturnValue(promise);

      const { loading, get } = useApi(null);
      const getPromise = get('test', {});

      expect(loading.value).toBe(true);

      resolvePromise!(mockResponse);
      await getPromise;

      expect(loading.value).toBe(false);
    });

    it('должен сбрасывать loading в false при ошибке', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed'));

      const { loading, get } = useApi(null);

      await get('test', {});

      expect(loading.value).toBe(false);
    });

    it('должен корректно обрабатывать несколько последовательных запросов', async () => {
      const mockResponse1 = { data: { id: 1 } };
      const mockResponse2 = { data: { id: 2 } };

      mockAxiosInstance.get
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const { data, get } = useApi(null);

      await get('test1', {});
      expect(data.value).toEqual({ id: 1 });

      await get('test2', {});
      expect(data.value).toEqual({ id: 2 });
    });
  });

  describe('Сброс ошибок', () => {
    it('должен сбрасывать error перед новым запросом', async () => {
      mockAxiosInstance.get
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockResponse);

      const { error, get } = useApi(null);

      await get('test', {});
      expect(error.value).toBe('First error');

      await get('test', {});
      expect(error.value).toBeNull();
    });

    it('должен сохранять предыдущую data при ошибке', async () => {
      const initialData = { id: 1 };
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed'));

      const { data, get } = useApi(initialData);

      await get('test', {});

      expect(data.value).toEqual(initialData);
    });
  });

  describe('Типизация', () => {
    it('должен корректно типизировать данные', () => {
      interface User {
        id: number;
        name: string;
      }

      const { data } = useApi<User>({ id: 0, name: '' });

      expect(data.value.id).toBe(0);
      expect(data.value.name).toBe('');
    });

    it('должен работать с массивом типизированных данных', () => {
      interface Item {
        id: number;
      }

      const { data } = useApi<Item[]>([]);

      expect(data.value).toEqual([]);
    });
  });

  describe('Интеграция', () => {
    it('должен корректно обрабатывать последовательные GET и POST запросы', async () => {
      const getResponse = { data: { list: [1, 2, 3] } };
      const postResponse = { data: { id: 4 } };

      mockAxiosInstance.get.mockResolvedValueOnce(getResponse);
      mockAxiosInstance.post.mockResolvedValueOnce(postResponse);

      const { data, get, post } = useApi(null);

      await get('/items', {});
      expect(data.value).toEqual({ list: [1, 2, 3] });

      await post('/items', { name: 'New' });
      expect(data.value).toEqual({ id: 4 });
    });
  });
});
