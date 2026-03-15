import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    count: 0
  })

  /*// Геттеры (аналог computed)
  getters: {
    doubleCount: (state) => state.count * 2,
  },

  // Действия (аналог methods)
  actions: {
    increment() {
      this.count++
    },
  },*/
});
