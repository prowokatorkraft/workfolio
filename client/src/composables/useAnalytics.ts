import { ref } from 'vue';
import axios from 'axios';
import type { UserStatistics } from '../types/UserStatistics.ts';

const baseUrl = window.location.origin + '/api/analytic';
const api = axios.create({
  baseURL: window.location.origin,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function useAnalytics() {
  const analytics = ref<UserStatistics | undefined>(undefined);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchAnalytics = async () => {
    loading.value = true;
    error.value = null;

    try {
      analytics.value = (await api.get(baseUrl + '/users')).data;
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

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
}
