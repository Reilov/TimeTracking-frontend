# TimeTracking (Frontend) 🕒

![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-ffe500?style=for-the-badge&logo=pinia&logoColor=000)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

Веб-приложение для учета рабочего времени сотрудников, разработанное в качестве дипломного проекта для компании [СервисКлауд](https://scloud.ru/).

## 🌟 Демо

Доступно живое демо: [https://app.dfaaqq.duckdns.org/](https://app.dfaaqq.duckdns.org/)

## 🔑 Тестовые аккаунты

При первом входе отображается форма авторизации. Доступные тестовые аккаунты:

| Роль        | Email             | Пароль    |
|-------------|-------------------|-----------|
| Сотрудник   | andrey@company.com| testik    |
| Сотрудник   | egor@company.com  | test      |
| HR          | hr@company.com    | hrcompany |

**Возможности:**
- � **Сотрудники**: просмотр своего рабочего времени
- 📊 **HR**: управление временем сотрудников, формирование отчетов, управление отпусками

## 🛠 Технологический стек

- **Vue 3** - фронтенд фреймворк
- **Pinia** - управление состоянием
- **Tailwind CSS** - стилизация
- **Vue Router** - маршрутизация
- **Chart.js** - визуализация данных
- **xlsx, jspdf, html2pdf.js** - работа с документами
- **V-Calendar** - работа с датами
- **Axios** - HTTP-запросы

Полный список зависимостей в `package.json`

## 🚀 Локальная установка

Для запуска проекта необходимо:

1. **Клонировать репозиторий**
   ```bash
   git clone https://github.com/Reilov/TimeTracking-frontend.git
   cd time-tracking-frontend
   ```

2. **Установить зависимости**
   ```bash
   npm install
   ```

3. **Настроить бэкенд**  
   Для работы приложения требуется запущенный бэкенд. Инструкции по его развертыванию можно найти в [соответствующем репозитории](https://github.com/Reilov/time-tracking-backend).

4. **Настройка переменных окружения**

   Проект использует систему окружений Vite:
   
   - Для **development** режима (локальная разработка):
     ```bash
     cp .env.development.example .env.development
     ```
     Затем отредактируйте `.env.development`:
     ```env
     VITE_API_BASE_URL=http://localhost:ваш-порт-бэкенда/
     ```
   
   - Для **production** сборки (деплой на сервер):
     ```bash
     cp .env.production.example .env.production
     ```
     Затем отредактируйте `.env.production`:
     ```env
     VITE_API_BASE_URL=https://ваш-продакшен-домен/
     ```
   
   ⚠️ Файлы `.env.*` добавляются в `.gitignore` и не должны попадать в репозиторий!

5. **Запуск**
   ```bash
   # Development режим
   npm run dev
   
   # Production сборка
   npm run build
   ```

## 📦 Команды проекта

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Проверка кода ESLint
npm run lint
```



---

Этот проект разработан в учебных целях.
