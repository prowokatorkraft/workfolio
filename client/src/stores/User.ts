import { defineStore } from 'pinia';
import type { User } from '../types/User.ts';

const initialUser: User = {
  name: 'Данил Тюрин',
  position: 'Full-stack разработчик',
  comment: 'Рассчитываю на продуктивное сотрудничество и возможность применить свои навыки для создания качественных IT‑решений',
  location: {
    city: 'Саратов',
    country: 'Россия',
    canRelocate: false,
    canBusinessTrip: true
  },
  contacts: {
    phone: '+79878294398',
    phoneInfo: '+ 7 (987) 829-43-98',
    mail: 'prowokatorkraft@gmail.com',
    vk: 'https://vk.com/dt_1995',
    telegram: 'https://t.me/DlTyurin',
    telegramInfo: '@DlTyurin'
  }
};

export const useUserStore = defineStore('user', {
  state: () => ({
    user: initialUser
  }),

  getters: {
    canBusinessTrip: (state) =>
      state.user.location.canBusinessTrip ? 'Готов к командировкам' : 'Не готов к командировкам',
    canRelocate: (state) =>
      state.user.location.canRelocate ? 'Готов к релокации' : 'Не готов к релокации'
  }
  /*
    // Действия (аналог methods)
    actions: {
      increment() {
        this.count++
      },
    },*/
});
