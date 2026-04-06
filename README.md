# 📊 WorkFolio

<div align="center">

### Профессиональное портфолио с системой аналитики

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=black)](https://pinia.vuejs.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-262627?style=for-the-badge&logo=typeorm&logoColor=white)](https://typeorm.io/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 📖 О проекте

**WorkFolio** — это не просто портфолио, а полноценная платформа, которая:

| Функция | Описание |
|---------|----------|
| 🎯 **Презентация опыта** | Демонстрация профессионального пути, навыков и проектов |
| 📊 **Аналитика** | Сбор и визуализация поведения посетителей в реальном времени |
| 🔥 **Инсайты** | Понимание, какие навыки и проекты действительно интересуют работодателей |
| 💡 **Демонстрация навыков** | Экспертный уровень владения современным JavaScript-стеком |

> Проект разработан в рамках курса **«JavaScript Developer. Professional»**

---

## 🛠️ Технологический стек

### 🎨 Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Vue 3** | ^3.3 | Основной фреймворк |
| **Composition API** | - | Реактивная логика |
| **Pinia** | ^2.1 | Управление состоянием |
| **Vue Router** | ^4.2 | Маршрутизация |
| **Vite** | ^4.4 | Сборка и HMR |
| **TypeScript** | ^5.1 | Типизация |
| **Jest + Vue Test Utils** | ^29.6 | Unit-тестирование |

### ⚙️ Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| **NestJS** | ^10.0 | Backend фреймворк |
| **Node.js** | 18+ | Среда выполнения |
| **TypeORM** | ^0.3 | ORM и миграции |
| **PostgreSQL** | 15 | База данных |
| **Jest** | ^29.6 | Unit и e2e тесты |

### 🛠️ Инструменты качества

| Технология | Назначение |
|------------|------------|
| **ESLint** | Линтинг кода |
| **Prettier** | Форматирование |
| **Concurrently** | Параллельный запуск |

---

## 📁 Структура проекта
```bash
workfolio/
├── client/ # Vue 3 фронтенд
│ ├── src/
│ │ ├── components/ # UI компоненты
│ │ ├── stores/ # Pinia хранилища
│ │ ├── composables/ # Переиспользуемая логика
│ │ ├── pages/ # Страницы
│ │ ├── lib/ # Библиотеки
│ │ ├── types/ # TypeScript типы
│ │ └── views/ # Страницы
│ └── tests/ # Frontend тесты
│
├── server/ # NestJS бэкенд
│ ├── src/
│ │ ├── analytic/ # Модуль аналитики
│ │ ├── event/ # Модуль событий
│ │ └── shared/ # Общие сущности
│ │   ├── entities/ # TypeORM сущности
│ │   ├── guards/ # Guard'ы (DevelopmentOnlyGuard)
│ │   └── middleware/ # Промежуточные сервисы
│ ├── test/ # Backend тесты
│ ├── migrations/ # TypeORM миграции
│ └── package.json # Корневой package.json
└── README.md
```

## 🚀 Быстрый старт

### 📋 Требования

- Node.js 18+
- PostgreSQL 14+
- npm 9+

### 🔧 Установка

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

# 5. Запуск приложения
cd ./server
npm run dev
