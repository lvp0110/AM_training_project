# AM Project

Веб-приложение на React для представления информации о материалах и продукции.

## 🚀 Технологии

- **React** 19.2.0
- **Vite** 7.2.2
- **React Router DOM** 6.8.1
- **React Markdown** 10.1.0
- **ESLint** для проверки кода

## 📁 Структура проекта

```
src/
├── components/     # Переиспользуемые компоненты
│   ├── Header.jsx
│   └── Footer.jsx
├── pages/          # Страницы приложения
│   ├── Home.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── App.jsx         # Главный компонент
└── main.jsx        # Точка входа
```

## 📦 Установка

### Требования
- Node.js (версия 18 или выше)
- npm или yarn

### Шаги установки

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd am_project
```

2. Установите зависимости:
```bash
npm install
```

## 🛠️ Разработка

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173/AM_training_project/`

**Важно для локальной разработки:**
- Открывайте приложение **только** по адресу `http://localhost:5173/AM_training_project/`
- Запросы `/api/*` проксируются на `http://localhost:3005` (локальный бэкенд). Для другого хоста задайте в `.env` переменную `VITE_API_PROXY_TARGET` (например `https://dev3.constrtodo.ru:3005`)
- Если порт 5173 занят, освободите его: `lsof -i :5173` → `kill <PID>`
- При ошибке WebSocket/HMR убедитесь, что нет конфликта портов (другие Vite-проекты, `vite preview`)

### Проверка кода

```bash
npm run lint
```

## 🏗️ Сборка

### Сборка для production

```bash
npm run build
```

Собранные файлы будут находиться в папке `dist`

### Просмотр production сборки

```bash
npm run preview
```

## 📝 Доступные скрипты

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка для production
- `npm run preview` - предпросмотр production сборки
- `npm run lint` - проверка кода с помощью ESLint

## 🚀 Деплой

### GitHub Pages

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

**Важно:** Перед первым деплоем необходимо:

1. Включить GitHub Pages в настройках репозитория:
   - Settings → Pages
   - Source: GitHub Actions

2. Base path уже настроен в `vite.config.js` для репозитория `AM_training_project`:
   ```js
   base: '/AM_training_project/',
   ```
   
   Если вы используете другой репозиторий, обновите это значение в `vite.config.js`.

3. **Настройка API URL для production:**
   
   Для работы API в production необходимо указать URL вашего API сервера. Есть два способа:

   **Техкарта (`/api/v2/techcard/...`):** на `https://dev3.constrtodo.ru:3005` общие маршруты (например `botservice`) отвечают, а путь `techcard` сейчас отдаёт **404**. Страница «Техлист» берёт хост из `VITE_TECHCARD_API_URL`, если он задан, иначе — тот же базовый URL, что и остальные запросы (`VITE_API_URL` / `src/apiBase.js`). Чтобы техкарта работала с GitHub Pages, укажите в **Secrets** переменную `VITE_TECHCARD_API_URL` на.origin, где реально развёрнут techcard (тот же формат без завершающего `/`, что и для `VITE_API_URL`).
   
   **Способ 1: Через GitHub Secrets (рекомендуется)**
   - Перейдите в Settings → Secrets and variables → Actions
   - Создайте новый secret с именем `VITE_API_URL` и значением URL вашего API (например, `https://api.example.com`)
   - Обновите `.github/workflows/deploy.yml`, чтобы использовать этот secret:
     ```yaml
     - name: Build project
       run: npm run build
       env:
         VITE_API_URL: ${{ secrets.VITE_API_URL }}
     ```
   
   **Способ 2: Через файл .env.production**
   - Создайте файл `.env.production` в корне проекта:
     ```
     VITE_API_URL=https://your-api-server.com
     ```
   - Добавьте его в репозиторий (⚠️ **не рекомендуется** для приватных API URL)

После настройки, каждый push в ветку `main` автоматически запустит сборку и деплой.

### Другие платформы

Проект также можно задеплоить на:
- **Vercel**: автоматически определяет Vite и собирает проект
- **Netlify**: использует команду `npm run build` и папку `dist`
- **Cloudflare Pages**: аналогично Netlify

## ✨ Возможности

- Просмотр информации о продукции
- Изучение технических характеристик
- Просмотр цветовой гаммы
- Контактная форма для вопросов
- Адаптивный дизайн
- Маршрутизация между страницами

## 📄 Лицензия

MIT
