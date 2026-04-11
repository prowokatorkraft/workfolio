# WorkFolio - Профессиональное портфолио с системой аналитики

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

---

## Установка

```bash
# 1. Клонирование репозитория
git clone https://github.com/prowokatorkraft/workfolio
cd workfolio

# 2. Установка зависимостей
npm install

# 4. Настройка окружения
cat > client/.env << EOF
VITE_API_URL=https://workfolio.com/
VITE_LOG=true
VITE_PRODUCTION=false
EOF

cat > server/.env << EOF
PORT=3000;
DB_HOST=localhost;
DB_NAME=workfolio;
DB_PORT=5432;
DB_USERNAME=postgres;
DB_PASSWORD=postgres;
DB_SSL=false
NODE_ENV=development
EOF

# 5. Сборка и миграция
cd ./server
npm run build

# 6. Запуск приложения
npm run dev
```
