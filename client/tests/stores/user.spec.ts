import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@../../../src/stores/User';

describe('useUserStore', () => {
  let store: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с начальными данными пользователя', () => {
      expect(store.user).toMatchObject({
        name: 'Данил Тюрин',
        position: 'Full-stack разработчик',
        comment:
          'Рассчитываю на продуктивное сотрудничество и возможность применить свои навыки для создания качественных IT‑решений',
      });
    });

    it('должен правильно инициализировать локацию', () => {
      expect(store.user.location).toEqual({
        city: 'Саратов',
        country: 'Россия',
        canRelocate: false,
        canBusinessTrip: true,
      });
    });

    it('должен правильно инициализировать контакты', () => {
      expect(store.user.contacts).toMatchObject({
        phone: '+79878294398',
        phoneInfo: '+ 7 (987) 829-43-98',
        mail: 'prowokatorkraft@gmail.com',
        vk: 'https://vk.com/dt_1995',
        telegram: 'https://t.me/DlTyurin',
        telegramInfo: '@DlTyurin',
      });
    });
  });

  describe('Вычисляемые свойства (computed)', () => {
    describe('canBusinessTrip', () => {
      it('должен возвращать "Готов к командировкам" если canBusinessTrip = true', () => {
        expect(store.canBusinessTrip).toBe('Готов к командировкам');
      });

      it('должен возвращать "Не готов к командировкам" если canBusinessTrip = false', () => {
        store.setBusinessTripStatus(false);
        expect(store.canBusinessTrip).toBe('Не готов к командировкам');
      });
    });

    describe('canRelocate', () => {
      it('должен возвращать "Готов к релокации" если canRelocate = true', () => {
        store.setRelocationStatus(true);
        expect(store.canRelocate).toBe('Готов к релокации');
      });

      it('должен возвращать "Не готов к релокации" если canRelocate = false', () => {
        store.setRelocationStatus(false);
        expect(store.canRelocate).toBe('Не готов к релокации');
      });
    });

    describe('fullName', () => {
      it('должен возвращать полное имя пользователя', () => {
        expect(store.fullName).toBe('Данил Тюрин');
      });

      it('должен обновляться при изменении имени', () => {
        store.updateName('Иван Иванов');
        expect(store.fullName).toBe('Иван Иванов');
      });
    });

    describe('fullLocation', () => {
      it('должен возвращать город и страну через запятую', () => {
        expect(store.fullLocation).toBe('Саратов, Россия');
      });

      it('должен обновляться при изменении локации', () => {
        store.updateLocation({ city: 'Москва', country: 'Россия' });
        expect(store.fullLocation).toBe('Москва, Россия');
      });
    });

    describe('mainContacts', () => {
      it('должен возвращать основные контакты (телефон, email, telegram)', () => {
        expect(store.mainContacts).toEqual({
          phone: '+ 7 (987) 829-43-98',
          email: 'prowokatorkraft@gmail.com',
          telegram: '@DlTyurin',
        });
      });

      it('должен обновляться при изменении контактов', () => {
        store.updatePhone('+79991234567', '+ 7 (999) 123-45-67');
        store.updateEmail('newemail@example.com');
        store.updateSocialLinks('https://vk.com/new', 'https://t.me/new', '@newtelegram');

        expect(store.mainContacts).toEqual({
          phone: '+ 7 (999) 123-45-67',
          email: 'newemail@example.com',
          telegram: '@newtelegram',
        });
      });
    });
  });

  describe('Методы обновления пользователя', () => {
    describe('updateUser', () => {
      it('должен обновлять несколько полей пользователя одновременно', () => {
        store.updateUser({
          name: 'Новое Имя',
          position: 'Senior Developer',
          comment: 'Новый комментарий',
        });

        expect(store.user.name).toBe('Новое Имя');
        expect(store.user.position).toBe('Senior Developer');
        expect(store.user.comment).toBe('Новый комментарий');
      });

      it('должен частично обновлять пользователя', () => {
        store.updateUser({ name: 'Только имя' });
        expect(store.user.name).toBe('Только имя');
        expect(store.user.position).toBe('Full-stack разработчик'); // не изменилось
      });

      it('не должен затрагивать другие поля при частичном обновлении', () => {
        const originalLocation = { ...store.user.location };
        store.updateUser({ name: 'Новое имя' });
        expect(store.user.location).toEqual(originalLocation);
      });
    });

    describe('updateLocation', () => {
      it('должен обновлять локацию', () => {
        store.updateLocation({
          city: 'Москва',
          country: 'Россия',
          canRelocate: true,
          canBusinessTrip: false,
        });

        expect(store.user.location).toEqual({
          city: 'Москва',
          country: 'Россия',
          canRelocate: true,
          canBusinessTrip: false,
        });
      });

      it('должен частично обновлять локацию', () => {
        store.updateLocation({ city: 'Санкт-Петербург' });
        expect(store.user.location.city).toBe('Санкт-Петербург');
        expect(store.user.location.country).toBe('Россия'); // не изменилось
      });
    });

    describe('updateContacts', () => {
      it('должен обновлять контакты', () => {
        const contacts = {
          phone: '+79990001122',
          phoneInfo: '+ 7 (999) 000-11-22',
          max: 'https://max.ru/u/test',
          mail: 'test@example.com',
          vk: 'https://vk.com/test',
          telegram: 'https://t.me/test',
          telegramInfo: '@test',
        };

        store.updateContacts(contacts);

        expect(store.user.contacts).toStrictEqual(contacts);
      });

      it('должен частично обновлять контакты', () => {
        const oldPhone = store.user.contacts.phone;

        store.updateContacts({ mail: 'newemail@example.com' });
        expect(store.user.contacts.mail).toBe('newemail@example.com');
        expect(store.user.contacts.phone).toBe(oldPhone);
      });
    });
  });

  describe('Сеттеры для отдельных полей', () => {
    describe('setRelocationStatus', () => {
      it('должен устанавливать статус релокации', () => {
        expect(store.user.location.canRelocate).toBe(false);
        store.setRelocationStatus(true);
        expect(store.user.location.canRelocate).toBe(true);
      });
    });

    describe('setBusinessTripStatus', () => {
      it('должен устанавливать статус командировок', () => {
        const oldValue = store.user.location.canBusinessTrip;
        store.setBusinessTripStatus(!oldValue);
        expect(store.user.location.canBusinessTrip).toBe(!oldValue);
      });
    });

    describe('updateName', () => {
      it('должен обновлять имя', () => {
        store.updateName('Алексей Смирнов');
        expect(store.user.name).toBe('Алексей Смирнов');
      });
    });

    describe('updatePosition', () => {
      it('должен обновлять должность', () => {
        store.updatePosition('Frontend Developer');
        expect(store.user.position).toBe('Frontend Developer');
      });
    });

    describe('updateComment', () => {
      it('должен обновлять комментарий', () => {
        store.updateComment('Новый комментарий о себе');
        expect(store.user.comment).toBe('Новый комментарий о себе');
      });
    });

    describe('updatePhone', () => {
      it('должен обновлять телефон и его форматированную версию', () => {
        store.updatePhone('+79991112233', '+ 7 (999) 111-22-33');
        expect(store.user.contacts.phone).toBe('+79991112233');
        expect(store.user.contacts.phoneInfo).toBe('+ 7 (999) 111-22-33');
      });
    });

    describe('updateEmail', () => {
      it('должен обновлять email', () => {
        store.updateEmail('newemail@example.com');
        expect(store.user.contacts.mail).toBe('newemail@example.com');
      });
    });

    describe('updateSocialLinks', () => {
      it('должен обновлять социальные ссылки', () => {
        store.updateSocialLinks(
          'https://vk.com/newprofile',
          'https://t.me/newprofile',
          '@newprofile'
        );

        expect(store.user.contacts.vk).toBe('https://vk.com/newprofile');
        expect(store.user.contacts.telegram).toBe('https://t.me/newprofile');
        expect(store.user.contacts.telegramInfo).toBe('@newprofile');
      });
    });
  });

  describe('Сброс к начальному состоянию', () => {
    it('должен сбрасывать все изменения к начальным значениям', () => {
      store.updateName('Измененное Имя');
      store.updatePosition('Измененная Должность');
      store.updateComment('Измененный комментарий');
      store.setRelocationStatus(true);
      store.setBusinessTripStatus(false);
      store.updatePhone('+79990000000', '+ 7 (999) 000-00-00');
      store.updateEmail('changed@example.com');
      store.updateSocialLinks('https://vk.com/changed', 'https://t.me/changed', '@changed');

      expect(store.user.name).toBe('Измененное Имя');
      expect(store.user.position).toBe('Измененная Должность');
      expect(store.user.location.canRelocate).toBe(true);
      expect(store.user.location.canBusinessTrip).toBe(false);

      store.resetToInitial();

      expect(store.user.name).not.toBe('Измененное Имя');
      expect(store.user.position).not.toBe('Измененная Должность');
    });

    it('должен сбрасывать вычисляемые свойства после сброса', () => {
      const oldRelocate = store.user.location.canRelocate;
      const oldBusinessTrip = store.user.location.canBusinessTrip;

      store.setRelocationStatus(!oldRelocate);
      store.setBusinessTripStatus(!oldBusinessTrip);

      expect(store.canRelocate).toBe(!oldRelocate ? 'Готов к релокации' : 'Не готов к релокации');
      expect(store.canBusinessTrip).toBe(
        !oldBusinessTrip ? 'Готов к командировкам' : 'Не готов к командировкам'
      );

      store.resetToInitial();

      expect(store.canRelocate).toBe(oldRelocate ? 'Готов к релокации' : 'Не готов к релокации');
      expect(store.canBusinessTrip).toBe(oldBusinessTrip ? 'Готов к командировкам' : 'Не готов к командировкам');
    });
  });

  describe('Комплексные сценарии', () => {
    it('должен корректно обновлять несколько полей последовательно', () => {
      store.updateName('Новое Имя');
      store.updatePosition('Team Lead');
      store.updateLocation({ city: 'Новосибирск' });
      store.updatePhone('+79998887766', '+ 7 (999) 888-77-66');

      expect(store.user.name).toBe('Новое Имя');
      expect(store.user.position).toBe('Team Lead');
      expect(store.user.location.city).toBe('Новосибирск');
      expect(store.user.contacts.phone).toBe('+79998887766');
    });

    it('должен корректно обрабатывать частичные обновления через updateUser', () => {
      const originalLocation = { ...store.user.location };
      const originalContacts = { ...store.user.contacts };

      store.updateUser({ name: 'Только имя' });

      expect(store.user.name).toBe('Только имя');
      expect(store.user.location).toEqual(originalLocation);
      expect(store.user.contacts).toEqual(originalContacts);
    });

    it('должен сохранять неизменные поля при обновлении контактов', () => {
      const originalVk = store.user.contacts.vk;
      const originalTelegram = store.user.contacts.telegram;

      store.updateContacts({ mail: 'new@example.com' });

      expect(store.user.contacts.mail).toBe('new@example.com');
      expect(store.user.contacts.vk).toBe(originalVk);
      expect(store.user.contacts.telegram).toBe(originalTelegram);
    });
  });

  describe('Граничные случаи', () => {
    it('должен корректно обрабатывать пустые строки при обновлении', () => {
      store.updateName('');
      expect(store.user.name).toBe('');

      store.updatePosition('');
      expect(store.user.position).toBe('');

      store.updateComment('');
      expect(store.user.comment).toBe('');
    });

    it('должен корректно обрабатывать обновление со специальными символами', () => {
      const specialName = 'Имя с @special #chars $%^';
      store.updateName(specialName);
      expect(store.user.name).toBe(specialName);
    });

    it('должен корректно обрабатывать длинные строки', () => {
      const longComment = 'А'.repeat(1000);
      store.updateComment(longComment);
      expect(store.user.comment).toBe(longComment);
    });
  });
});
