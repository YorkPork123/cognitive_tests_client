# Веб-часть проекта: Когнитивные тесты на Vue

Этот репозиторий содержит веб-часть проекта, реализованную на Vue.js. Веб-приложение предоставляет пользователю доступ к 21 когнитивному тесту, каждый из которых является отдельным приложением.

## Структура проекта

- **apps**: Директория, содержащая все когнитивные тесты. Каждый тест находится в отдельной папке `app<n>`, где `n` — номер теста.
- **assets**: Ресурсы проекта, такие как изображения, шрифты и другие статические файлы.
- **components**: Vue-компоненты, используемые в проекте.
- **router**: Конфигурация маршрутизации для Vue Router.
- **services**: Сервисы для работы с API (например, сохранение результатов тестов).
- **App.vue**: Главный компонент приложения.
- **main.js**: Точка входа для Vue.js.
- **style.css**: Глобальные стили для приложения.

## Установка и запуск

1. Убедитесь, что у вас установлены [Node.js](https://nodejs.org/) и [npm](https://www.npmjs.com/).
2. Клонируйте репозиторий:
   ```bash
     git clone https://github.com/Michail-Gorev/brain-tests.git
   ```
3. Перейдите в директорию проекта:
  ```bash
    cd brain-tests
  ```
4. Установите зависимости:
  ```bash
  npm install
  ```
5. Запустите проект (в режиме разработчика):
  ```bash
  npm run dev
  ```

Вот часть `README.md`, посвящённая добавлению собственных тестов в проект:

---

## Добавление собственных тестов

Чтобы добавить новый тест в проект, выполните следующие шаги:

### 1. Создание структуры папок
1. Создайте новую папку для вашего теста в директории `src/apps`. Название папки должно соответствовать шаблону `app<n>`, где `n` — номер теста (например, `app22` для 22-го теста).
2. Внутри созданной папки создайте необходимые поддиректории, такие как:
   - `components` — для компонентов, используемых в тесте.
   - Другие папки, если они требуются для вашего теста (например, `assets`, `utils` и т.д.).

### 2. Создание основных файлов
1. Создайте файл `App.vue` в корне папки вашего теста. Этот файл будет основным компонентом теста.
   ```vue
   <template>
     <div>
       <!-- Ваш код теста -->
     </div>
   </template>

   <script>
   export default {
     name: 'App<N>', // Замените <N> на номер вашего теста
     // Логика теста
   };
   </script>

   <style scoped>
   /* Стили для теста */
   </style>
   ```

2. Создайте файл `Wrapper.vue` в корне папки вашего теста. Этот файл будет обёрткой для вашего теста.
   ```vue
   <template>
     <App<N> /> <!-- Замените <N> на номер вашего теста -->
   </template>

   <script>
   import App<N> from './App.vue'; // Замените <N> на номер вашего теста

   export default {
     components: {
       App<N>, // Замените <N> на номер вашего теста
     },
   };
   </script>
   ```

### 3. Добавление теста в меню
1. Откройте файл `src/components/Menu.vue`.
2. Найдите массив `tests` в секции `data` и добавьте новый объект с информацией о вашем тесте:
   ```javascript
   tests: [
     // Существующие тесты
     { id: 1, title: 'Тест Мюнстерберга', url: '/app1' },
     { id: 2, title: 'Совпадающие цифры', url: '/app2' },
     // ...
     { id: 22, title: 'Название вашего теста', url: '/app22' }, // Добавьте ваш тест
   ],
   ```

### 4. Добавление маршрута
1. Откройте файл `src/router/index.js`.
2. Импортируйте ваш `Wrapper.vue` в начало файла:
   ```javascript
   import App<N>Wrapper from '@/apps/app<N>/Wrapper.vue'; // Замените <N> на номер вашего теста
   ```
3. Добавьте новый маршрут в массив `routes`:
   ```javascript
   const routes = [
     // Существующие маршруты
     { path: '/app1', component: App1Wrapper, meta: { requiresAuth: true } },
     { path: '/app2', component: App2Wrapper, meta: { requiresAuth: true } },
     // ...
     { path: '/app<N>', component: App<N>Wrapper, meta: { requiresAuth: true } }, // Добавьте ваш маршрут
   ];
   ```

### 5. Проверка
1. Запустите проект:
   ```bash
   npm run dev
   ```
2. Убедитесь, что ваш тест появился в меню и корректно отображается по соответствующему маршруту.

---
Добавлю раздел в `README.md`, посвящённый настройке приложения для работы с собственным сервером Django. Вот обновлённый текст:

---

## Настройка для работы с сервером Django

Для интеграции приложения с вашим сервером Django необходимо отредактировать файл `src/services/api.js`. Этот файл отвечает за взаимодействие с API сервера.

### 1. Редактирование `api.js`

1. Откройте файл `src/services/api.js`.
2. Убедитесь, что переменная `API_BASE_URL` указывает на ваш Django-сервер. Например:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000';  // Укажите URL вашего Django-сервера
   ```
   Если ваш сервер размещён на другом домене или порту, измените значение этой переменной.

3. Проверьте, что все методы API соответствуют эндпоинтам вашего Django-сервера:
   - **Регистрация пользователя**:
     ```javascript
     export const registerUser = async (userData) => {
         try {
             const response = await api.post('/api/register/', userData);
             return response.data;
         } catch (error) {
             console.error('Ошибка при регистрации:', error);
             throw error;
         }
     };
     ```
   - **Авторизация пользователя**:
     ```javascript
     export const loginUser = async (userData) => {
         try {
             const response = await api.post('/api/login/', userData);
             return response.data;
         } catch (error) {
             console.error('Ошибка при входе:', error);
             throw error;
         }
     };
     ```
   - **Отправка результатов теста**:
     ```javascript
     export const sendTestResult = async (result) => {
         try {
             const response = await api.post('/api/save_test_result/', result);
             return response.data;
         } catch (error) {
             console.error('Ошибка при отправке результата:', error);
             throw error;
         }
     };
     ```

### 2. Настройка CORS на сервере Django

Убедитесь, что ваш Django-сервер настроен для обработки запросов с вашего фронтенд-приложения. Для этого:
1. Установите пакет `django-cors-headers`, если он ещё не установлен:
   ```bash
   pip install django-cors-headers
   ```
2. Добавьте `corsheaders` в `INSTALLED_APPS` в `settings.py`:
   ```python
   INSTALLED_APPS = [
       ...
       'corsheaders',
       ...
   ]
   ```
3. Добавьте `CorsMiddleware` в `MIDDLEWARE`:
   ```python
   MIDDLEWARE = [
       ...
       'corsheaders.middleware.CorsMiddleware',
       ...
   ]
   ```
4. Разрешите запросы с вашего домена. Например:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:8080",  # Укажите домен вашего фронтенд-приложения
   ]
   ```

### 3. Проверка работы

1. Запустите ваш Django-сервер:
   ```bash
   python manage.py runserver
   ```
2. Запустите фронтенд-приложение:
   ```bash
   npm run dev
   ```
3. Убедитесь, что регистрация, авторизация и отправка результатов тестов работают корректно.

---
