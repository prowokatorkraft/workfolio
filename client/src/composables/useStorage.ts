import { ref, watch, type Ref } from 'vue';

export function useStorage<T>(
  key: string,
  defaultValue: T,
  storageType: 'local' | 'session' = 'local'
): Ref<T> {
  const storage = storageType === 'local' ? localStorage : sessionStorage;

  let storedValue: T;
  try {
    const item = storage.getItem(key);
    storedValue = item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading key "${key}" from storage:`, error);
    storedValue = defaultValue;
  }

  const data = ref<T>(storedValue) as Ref<T>;

  watch(
    data,
    (newValue) => {
      try {
        if (newValue === null || newValue === undefined) {
          storage.removeItem(key);
        } else {
          storage.setItem(key, JSON.stringify(newValue));
        }
      } catch (error) {
        console.error(`Error writing key "${key}" to storage:`, error);
      }
    },
    { deep: true }
  );

  return data;
}
