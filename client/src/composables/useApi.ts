import { ref } from 'vue';
import axios from 'axios';

const baseUrl = window.location.origin + '/api/';
const api = axios.create({
  baseURL: window.location.origin,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function useApi<T>(defaultValue: T) {
  const data = ref<T>(defaultValue);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const request = async (callback: () => Promise<void>) => {
    loading.value = true;
    error.value = null;

    try {
      await callback();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Unknown error occurred';
      }
    } finally {
      loading.value = false;
    }
  };

  const get = async (url: string, params: unknown) => {
    await request(async () => {
      data.value = (
        await api.get(baseUrl + url, {
          params: params
        })
      ).data;
    });
  };

  const post = async (url: string, params: unknown) => {
    await request(async () => {
      data.value = (await api.post(baseUrl + url, params)).data;
    });
  };

  return {
    data,
    loading,
    error,

    get,
    post
  };
}
