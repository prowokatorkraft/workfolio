// stores/About.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAboutStore = defineStore('about', () => {
  // Состояние
  const personalInfo = ref({
    name: 'Александр',
    fullName: 'Александр Иванович Петров',
    title: 'Full-stack разработчик',
    photo: '/src/assets/photo.jpg',
    age: 28,
    birthDate: '15.03.1996',
    maritalStatus: 'Холост',
    city: 'Москва',
    citizenship: 'РФ',
    relocation: 'Возможен',
    about: [
      'Full-stack разработчик с 5-летним опытом...',
      'Имею опыт работы как в стартапах...',
      'В свободное время веду технический блог...'
    ],
    qualities: ['Ответственность', 'Коммуникабельность', 'Аналитическое мышление', 'Обучаемость']
  });

  const contacts = ref([
    {
      type: 'email',
      icon: '✉️',
      label: 'Email',
      value: 'alexander@example.com',
      link: 'mailto:alexander@example.com'
    },
    {
      type: 'phone',
      icon: '📞',
      label: 'Телефон',
      value: '+7 (999) 123-45-67',
      link: 'tel:+79991234567'
    },
    {
      type: 'telegram',
      icon: '📱',
      label: 'Telegram',
      value: '@alexander_dev',
      link: 'https://t.me/alexander_dev',
      social: true
    }
  ]);

  const hobbies = ref([
    { name: 'Чтение книг', icon: '📚' },
    { name: 'Путешествия', icon: '✈️' },
    { name: 'Фотография', icon: '📷' }
  ]);

  const languages = ref([
    { name: 'Русский', level: 'Родной', progress: 100 },
    { name: 'Английский', level: 'B1 (Intermediate)', progress: 65 }
  ]);

  const stats = ref({
    age: 28,
    projects: 24,
    certificates: 12,
    yearsExperience: 5
  });

  // Геттеры (computed)
  const socialContacts = computed(() => contacts.value.filter((c) => c.social));
  const mainContacts = computed(() => contacts.value.filter((c) => !c.social));
  const totalHobbies = computed(() => hobbies.value.length);

  const ageWithSuffix = computed(() => {
    const age = personalInfo.value.age;
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${age} лет`;
    switch (lastDigit) {
      case 1:
        return `${age} год`;
      case 2:
      case 3:
      case 4:
        return `${age} года`;
      default:
        return `${age} лет`;
    }
  });

  // Действия (actions)
  function updatePersonalInfo(info: Partial<typeof personalInfo.value>) {
    personalInfo.value = { ...personalInfo.value, ...info };
  }

  function addQuality(quality: string) {
    if (!personalInfo.value.qualities.includes(quality)) {
      personalInfo.value.qualities.push(quality);
    }
  }

  function removeQuality(quality: string) {
    const index = personalInfo.value.qualities.indexOf(quality);
    if (index !== -1) personalInfo.value.qualities.splice(index, 1);
  }

  function updateLanguage(languageName: string, progress: number) {
    const language = languages.value.find((l) => l.name === languageName);
    if (language) {
      language.progress = progress;
      if (progress >= 95) language.level = 'C2 (Proficient)';
      else if (progress >= 85) language.level = 'C1 (Advanced)';
      else if (progress >= 70) language.level = 'B2 (Upper Intermediate)';
      else if (progress >= 55) language.level = 'B1 (Intermediate)';
      else if (progress >= 40) language.level = 'A2 (Elementary)';
      else language.level = 'A1 (Beginner)';
    }
  }

  return {
    // Состояние
    personalInfo,
    contacts,
    hobbies,
    languages,
    stats,
    // Геттеры
    socialContacts,
    mainContacts,
    totalHobbies,
    ageWithSuffix,
    // Действия
    updatePersonalInfo,
    addQuality,
    removeQuality,
    updateLanguage
  };
});
