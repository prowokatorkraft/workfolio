# WorkFolio

<div align="center">

### Профессиональное портфолио с системой аналитики

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=black)](https://pinia.vuejs.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-262627?style=for-the-badge&logo=typeorm&logoColor=white)](https://typeorm.io/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

> Проект разработан в рамках курса **«JavaScript Developer. Professional»**

---

## Технологический стек

### Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Vue 3** | ^3.5 | Основной фреймворк |
| **Composition API** | - | Реактивная логика |
| **Pinia** | ^3.0 | Управление состоянием |
| **Vue Router** | ^4.6 | Маршрутизация |
| **Vite** | ^8.0 | Сборка и HMR |
| **TypeScript** | ~5.9 | Типизация |
| **Vitest** | ^4.1 | Unit-тестирование |
| **Vue Test Utils** | ^2.4 | Тестирование Vue компонентов |
| **Axios** | ^1.14 | HTTP клиент |

### Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| **NestJS** | ^11.0 | Backend фреймворк |
| **Node.js** | 18+ | Среда выполнения |
| **TypeORM** | ^0.3 | ORM и миграции |
| **PostgreSQL** | 14+ | База данных |
| **Jest** | ^30.0 | Unit и e2e тесты |
| **class-validator** | ^0.15 | Валидация DTO |
| **class-transformer** | ^0.5 | Трансформация данных |

### Инструменты качества

| Технология | Назначение |
|------------|------------|
| **ESLint** | Линтинг кода |
| **Prettier** | Форматирование |
| **Concurrently** | Параллельный запуск |
| **TypeScript ESLint** | Типизированный линтинг |

---

## Структура проекта

```bash
workfolio/
├── client/                    # Vue 3 фронтенд
│   ├── src/
│   │   ├── components/        # UI компоненты
│   │   ├── stores/            # Pinia хранилища
│   │   ├── composables/       # Переиспользуемая логика
│   │   ├── pages/             # Страницы
│   │   ├── lib/               # Библиотеки и утилиты
│   │   └── types/             # TypeScript типы
│   └── tests/                 # Frontend тесты (Vitest)
│
├── server/                    # NestJS бэкенд
│   ├── src/
│   │   ├── analytic/          # Модуль аналитики
│   │   └── event/             # Модуль событий
│   ├── shared/                # Общие сущности
│   │   ├── entities/          # TypeORM сущности
│   │   ├── guards/            # Guard'ы
│   │   └── middleware/        # Промежуточные сервисы
│   ├── migrations/            # TypeORM миграции
│   └── data-source.ts         # TypeORM конфигурация
│
└── README.md
```

```bash
# 1. Клонирование репозитория
git clone https://github.com/prowokatorkraft/workfolio
cd workfolio

# 2. Установка зависимостей (одна команда для всего)
npm install

# 4. Настройка окружения
cat > client/.env << EOF
VITE_API_URL=https://workfolio.com/
VITE_LOG=true
VITE_PRODUCTION=false
EOF

cat > server/.env << EOF
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=workfolio
DB_PASSWORD=workfolio
DB_NAME=workfolio
DB_SSL=true
NODE_ENV=development
EOF

# 5. Сборка и миграция
cd ./server
npm run build

# 5. Запуск приложения
npm run dev
