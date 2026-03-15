export interface User {
  name: string;
  position: string;
  comment: string;
  location: {
    city: string;
    country: string;
    canRelocate: boolean;
    canBusinessTrip: boolean;
  };
  contacts: {
    phone: string;
    phoneInfo: string;
    mail: string;
    vk: string;
    telegram: string;
    telegramInfo: string;
  };
}