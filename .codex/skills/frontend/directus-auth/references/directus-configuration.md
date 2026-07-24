# Настройка Directus для frontend-аутентификации

Этот файл относится к серверу Directus. Frontend-код не сможет исправить
отключённую регистрацию, неверную роль или CORS.

## 1. Public URL

У Directus должен быть корректный публичный HTTPS URL:

```dotenv
PUBLIC_URL=https://api.example.com
```

Frontend:

```dotenv
PUBLIC_DIRECTUS_URL=https://api.example.com
```

Не добавляй `/auth/login` к базовому URL: SDK формирует endpoint сам.

## 2. CORS

Пример для локальной разработки и production:

```dotenv
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:4321,https://example.com
CORS_METHODS=GET,POST,PATCH,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization
CORS_EXPOSED_HEADERS=Content-Range
CORS_CREDENTIALS=true
```

Требования:

- origin включает протокол;
- порт localhost совпадает с фактическим;
- в production перечислены только разрешённые origins;
- `*` не использовать без отдельного обоснования;
- после изменения environment Directus перезапущен/переразвернут.

Для JSON auth cookies не нужны для access/refresh tokens, но корректный CORS
всё равно обязателен для browser requests.

Официальная таблица переменных:
<https://docs.directus.io/self-hosted/config-options#cors>.

## 3. Регистрация

В Directus Data Studio:

1. Открой Settings.
2. Включи User Registration.
3. Выбери неадминистративную роль новых пользователей.
4. При необходимости включи email verification.
5. Настрой email filter и почтовый транспорт.

Роль регистрации должна иметь только минимально необходимые permissions.
Нельзя назначать administrator role.

Официальное описание:
<https://docs.directus.io/user-guide/user-management/users#enable-user-registration>.

## 4. Verification URL

Если frontend передаёт `verification_url`, этот адрес должен входить в
`USER_REGISTER_URL_ALLOW_LIST`.

Пример:

```dotenv
USER_REGISTER_URL_ALLOW_LIST=https://example.com/auth/verify,http://localhost:4321/auth/verify
```

Не добавляй allow list, если приложение не передаёт собственный
`verification_url`.

API регистрации:
<https://docs.directus.io/reference/system/users#register-a-new-user>.

## 5. Permissions

Проверь минимум:

- Public role не читает приватные коллекции.
- Роль пользователя читает только разрешённые записи.
- Item permissions используют фильтры пользователя, где это необходимо.
- `/users/me` доступен авторизованному пользователю.
- Поля профиля ограничены по необходимости.
- Для регистрации используется public registration endpoint, а не публичное
  разрешение на создание записей в `directus_users`.

## 6. Token lifetime

JSON login возвращает короткоживущий access token и refresh token. SDK
`authentication()` использует `expires_at` для автоматического обновления.

Не заменяй пользовательскую сессию статическим token. Static token подходит
для контролируемого server-to-server доступа, а не для browser login.

Официальное описание типов токенов:
<https://docs.directus.io/reference/authentication#access-tokens>.

## 7. Диагностика

Проверяй Network:

```text
POST /users/register
POST /auth/login
POST /auth/refresh
GET  /users/me
POST /auth/logout
```

Уточнения:

- `/auth/refresh` появляется только при необходимости;
- `registerUser` возвращает пустой успешный response;
- после регистрации auto-login возможен только для активного пользователя;
- ошибка CORS в браузере часто скрывает реальный ответ Directus.

