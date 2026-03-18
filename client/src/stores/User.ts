import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/User.ts';

const initialUser: User = {
  name: 'Данил Тюрин',
  position: 'Full-stack разработчик',
  comment:
    'Рассчитываю на продуктивное сотрудничество и возможность применить свои навыки для создания качественных IT‑решений',
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

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({ ...initialUser });

  const canBusinessTrip = computed(() =>
    user.value.location.canBusinessTrip ? 'Готов к командировкам' : 'Не готов к командировкам'
  );

  const canRelocate = computed(() =>
    user.value.location.canRelocate ? 'Готов к релокации' : 'Не готов к релокации'
  );

  const fullName = computed(() => user.value.name);

  const fullLocation = computed(
    () => `${user.value.location.city}, ${user.value.location.country}`
  );

  const mainContacts = computed(() => ({
    phone: user.value.contacts.phoneInfo,
    email: user.value.contacts.mail,
    telegram: user.value.contacts.telegramInfo
  }));

  function updateUser(updates: Partial<User>) {
    user.value = { ...user.value, ...updates };
  }

  function updateLocation(locationUpdates: Partial<User['location']>) {
    user.value.location = { ...user.value.location, ...locationUpdates };
  }

  function updateContacts(contactsUpdates: Partial<User['contacts']>) {
    user.value.contacts = { ...user.value.contacts, ...contactsUpdates };
  }

  function setRelocationStatus(status: boolean) {
    user.value.location.canRelocate = status;
  }

  function setBusinessTripStatus(status: boolean) {
    user.value.location.canBusinessTrip = status;
  }

  function updateName(newName: string) {
    user.value.name = newName;
  }

  function updatePosition(newPosition: string) {
    user.value.position = newPosition;
  }

  function updateComment(newComment: string) {
    user.value.comment = newComment;
  }

  function updatePhone(phone: string, phoneInfo: string) {
    user.value.contacts.phone = phone;
    user.value.contacts.phoneInfo = phoneInfo;
  }

  function updateEmail(email: string) {
    user.value.contacts.mail = email;
  }

  function updateSocialLinks(vk: string, telegram: string, telegramInfo: string) {
    user.value.contacts.vk = vk;
    user.value.contacts.telegram = telegram;
    user.value.contacts.telegramInfo = telegramInfo;
  }

  function resetToInitial() {
    user.value = { ...initialUser };
  }

  return {
    user,

    canBusinessTrip,
    canRelocate,
    fullName,
    fullLocation,
    mainContacts,

    updateUser,
    updateLocation,
    updateContacts,
    setRelocationStatus,
    setBusinessTripStatus,
    updateName,
    updatePosition,
    updateComment,
    updatePhone,
    updateEmail,
    updateSocialLinks,
    resetToInitial
  };
});
