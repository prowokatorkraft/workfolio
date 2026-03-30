import { shallowRef } from 'vue';

export function useTimeBreaker(){
  const focusBreaker = shallowRef<Map<string, number>>(new Map<string, number>());

  const setBreak = (key: string, hash: number, breaking: number): number => {
    if (!focusBreaker.value.has(key)) {
      focusBreaker.value.set(key, hash);
      setTimeout(() => {
        focusBreaker.value.delete(key);
      }, breaking);
    }
    return hash;
  };

  const getBreak = (key: string): (number | undefined) => {
    if (focusBreaker.value.has(key)) {
      return focusBreaker.value.get(key);
    }
    return undefined;
  };

  const popBreak = (key: string): (number | undefined) => {
    const _break = getBreak(key);
    if (_break) {
      focusBreaker.value.delete(key);
    }
    return _break;
  };

  return {
    setBreak,
    getBreak,
    popBreak
  };
}
