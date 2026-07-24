---
name: directus-auth
description: >
  Полная реализация и перенос авторизации Directus в Astro-проекты с React:
  регистрация, вход, JSON access/refresh tokens, собственное browser storage,
  автоматическое обновление токена, проверка сессии, guest-only и protected
  guards, logout, обработка ошибок, настройка CORS и проверка результата.
  Используй навык при добавлении Directus-аутентификации с нуля, переносе
  существующей авторизации в другой проект или исправлении login/signup/logout
  и редиректов. Эталон поведения — реализация MySimpleEnglish.
---

# Directus Auth для Astro + React

Этот навык описывает переносимую клиентскую авторизацию, реализованную в
MySimpleEnglish. Он рассчитан на Astro-проект с React-формами и Directus как
API. Готовые файлы лежат в [`templates/`](./templates/), подробности настройки
и безопасности — в [`references/`](./references/).

## 1. Когда использовать

Подключай этот навык, если задача включает хотя бы один пункт:

- регистрация пользователя через Directus;
- вход по email и паролю;
- сохранение и автоматическое обновление access/refresh tokens;
- редирект авторизованного пользователя со страницы входа;
- запрет гостю открывать личный кабинет;
- выход через Directus с обязательной локальной очисткой;
- перенос такой же авторизации в другой Astro-проект;
- диагностика `INVALID_CREDENTIALS`, `TOKEN_EXPIRED`, CORS или пропавшей сессии.

Не используй эту реализацию без отдельного архитектурного решения, если
проекту нужна серверная проверка сессии в Astro middleware, HttpOnly cookies,
SSO/OAuth, MFA или повышенная защита токенов. См.
[`references/security-and-ssr.md`](./references/security-and-ssr.md).

## 2. Профиль реализации

Базовый профиль навыка:

| Часть | Решение |
|---|---|
| Frontend | Astro + React + TypeScript |
| SDK | официальный `@directus/sdk` |
| Auth mode | `json` |
| Хранилище | `localStorage` в браузере |
| Ключи | `directus_access_token`, `directus_refresh_token`, `directus_token_expires` |
| Обновление | автоматически через `authentication('json', { storage })` |
| Проверка | `getToken()` + `readMe({ fields: ['id'] })` |
| Регистрация | `registerUser(...)` |
| Вход | `directus.login(...)` |
| Выход | `directus.logout(...)`, затем обязательный `setToken(null)` |
| Навигация | `window.location.replace(...)` |

Это клиентская сессия. Middleware Astro не видит `localStorage`. Guards из
этого навыка управляют интерфейсом и навигацией, а реальную авторизацию данных
обеспечивают роли и policies Directus.

## 3. Перед реализацией

Сначала проверь:

1. Какой package manager используется по lock-файлу.
2. Есть ли уже `@directus/sdk`, React integration и общий API-клиент.
3. Где лежат формы и общие компоненты проекта.
4. Какие маршруты являются:
   - гостевыми, например `/`;
   - защищёнными, например `/cabinet`;
   - целевыми после входа и выхода.
5. Включена ли регистрация в Directus.
6. Требуется ли подтверждение email.
7. Разрешены ли localhost и production origins в CORS Directus.
8. Нет ли legacy-форм или обработчиков, которые продолжают отправлять запросы
   на старые `/site/login`, `/site/signup`, `/site/logout`.

Не создавай второй Directus-клиент. В приложении должен быть один общий
экземпляр с одним storage adapter.

## 4. Выбрать режим регистрации

До копирования хука зафиксируй один из вариантов:

- `autoLoginAfterSignup: true` — регистрация сразу сопровождается входом.
  Подходит, если Directus не требует подтверждения email.
- `autoLoginAfterSignup: false` — после регистрации показывается сообщение с
  просьбой подтвердить email, редиректа в кабинет нет.

Если email verification включён, автоматический login сразу после
`registerUser` обычно завершится ошибкой. Не маскируй её: отключи auto-login и
реализуй страницу подтверждения.

Сброс пароля, verification endpoint, профиль, MFA и SSO не входят в базовый
набор «как в MySimpleEnglish». Для их добавления используй отдельные потоки из
[`references/extensions.md`](./references/extensions.md), не смешивая их с
login/signup hook.

## 5. Установка

Используй package manager проекта. Для npm:

```bash
npm install @directus/sdk
```

Если React ещё не подключён:

```bash
npx astro add react
```

Не обновляй другие зависимости без необходимости.

Добавь во frontend `.env.example`:

```dotenv
PUBLIC_DIRECTUS_URL=https://api.example.com
```

`PUBLIC_DIRECTUS_URL` попадает в браузер и должен содержать только публичный
URL. Никогда не помещай туда admin token, `SECRET`, пароль или приватный
server-to-server token.

Настройки самого Directus описаны в
[`references/directus-configuration.md`](./references/directus-configuration.md).

## 6. Целевая структура

```text
src/
├── components/
│   ├── auth/
│   │   ├── GuestOnlyGuard.astro
│   │   ├── LogoutButton.astro
│   │   └── ProtectedPageGuard.astro
│   └── forms/
│       └── AuthForm.tsx
├── hooks/
│   └── useDirectusAuth.ts
└── lib/
    └── directus.ts
```

Расположение можно адаптировать к архитектуре проекта, но ответственность
слоёв не смешивай:

- `lib/directus.ts` — SDK, storage и операции с сессией;
- `hooks/useDirectusAuth.ts` — состояние login/signup и сообщения об ошибках;
- `forms/AuthForm.tsx` — поля, валидация и UI;
- `components/auth/*` — guards и logout.

## 7. Порядок переноса

### Шаг 1. Общий Directus-клиент

Скопируй [`templates/src/lib/directus.ts`](./templates/src/lib/directus.ts).

Обязательные свойства:

- не обращаться к `window` во время SSR;
- восстанавливать `access_token`, `refresh_token`, `expires_at`;
- передавать рассчитанный `expires`, чтобы SDK обновлял токен;
- очищать все три ключа при `setToken(null)`;
- проверять сессию через минимальный `readMe`;
- очищать локальную сессию в `finally` при logout.

### Шаг 2. React-хук

Скопируй
[`templates/src/hooks/useDirectusAuth.ts`](./templates/src/hooks/useDirectusAuth.ts).

Хук должен:

- иметь состояния `idle | loading | success | error`;
- не хранить DOM и разметку;
- нормализовать Directus error codes в понятные сообщения;
- поддерживать регистрацию с auto-login и email verification;
- возвращать отдельно `succeeded` и `authenticated`.

### Шаг 3. Форма

Скопируй
[`templates/src/components/forms/AuthForm.tsx`](./templates/src/components/forms/AuthForm.tsx)
и адаптируй только разметку и классы под дизайн проекта.

Не меняй функциональные инварианты:

- `event.preventDefault()`;
- email и имя перед отправкой проходят `trim()`;
- пароль не модифицируется;
- кнопка блокируется при `loading`;
- поля имеют корректные `autocomplete`;
- сообщение об ошибке имеет `role="alert"`;
- успешный вход использует `window.location.replace(redirectTo)`.

Подключай форму как React island:

```astro
<AuthForm
  client:load
  formId="login-form"
  mode="login"
  submitLabel="Войти"
  redirectTo="/cabinet"
/>
```

Для регистрации с подтверждением email:

```astro
<AuthForm
  client:load
  formId="signup-form"
  mode="signup"
  submitLabel="Зарегистрироваться"
  redirectTo="/cabinet"
  autoLoginAfterSignup={false}
/>
```

### Шаг 4. Guest-only guard

На страницу login/signup добавь
[`GuestOnlyGuard.astro`](./templates/src/components/auth/GuestOnlyGuard.astro)
в `<head>`:

```astro
<head>
  <GuestOnlyGuard redirectTo="/cabinet" />
  <!-- остальные head-теги -->
</head>
```

Guard скрывает страницу только на время проверки. Если Directus подтверждает
сессию, выполняется `replace('/cabinet')`; иначе форма показывается.

### Шаг 5. Protected guard

На приватную страницу добавь
[`ProtectedPageGuard.astro`](./templates/src/components/auth/ProtectedPageGuard.astro)
в `<head>`:

```astro
<ProtectedPageGuard loginPath="/" />
```

Клиентский guard не заменяет permissions Directus и не скрывает HTML от
пользователя, который целенаправленно читает исходный ответ. Не помещай
секретные данные в prerendered HTML.

### Шаг 6. Logout

Используй
[`LogoutButton.astro`](./templates/src/components/auth/LogoutButton.astro):

```astro
<LogoutButton class="btn btn-white" redirectTo="/">
  Выход
</LogoutButton>
```

Logout обязан:

1. предотвратить legacy-навигацию;
2. заблокировать повторный клик;
3. вызвать `/auth/logout` через SDK;
4. в `finally` удалить локальные токены;
5. через `replace('/')` вернуть на гостевую страницу.

Даже если API недоступен или refresh token уже недействителен, локальный
выход должен завершиться.

### Шаг 7. Удалить legacy auth

Найди и убери:

```text
/site/login
/site/signup
/site/register
/site/logout
data-method="post"
старые submit/click handlers
дублирующиеся формы с одинаковыми id
ручное сохранение токенов вне общего storage adapter
```

Проверь React-зоны на пересечение с глобальным jQuery/legacy JavaScript.

### Шаг 8. Документация

Обнови:

- `.env.example`;
- проектный `AGENTS.md`, если навык переносится в новый репозиторий;
- `SUMMARY.md`;
- README или deployment docs с Directus/CORS настройками.

## 8. Инварианты безопасности

- Directus roles/policies являются источником прав, а не frontend guard.
- Public role не должен получать доступ к приватным коллекциям.
- Роль саморегистрирующегося пользователя должна быть минимальной.
- Не передавай токены в query string.
- Не логируй credentials и auth response.
- Не вставляй пользовательский HTML без санитизации.
- `localStorage` доступен JavaScript и уязвим при XSS. Для чувствительного
  проекта выбери HttpOnly cookie/BFF архитектуру.
- Приватные данные загружай после успешной проверки сессии, а не в статический
  HTML.

Полный разбор: [`references/security-and-ssr.md`](./references/security-and-ssr.md).

Дополнительные auth-сценарии:
[`references/extensions.md`](./references/extensions.md).

## 9. Проверка

Запусти доступные команды проекта:

```bash
npm run format
npm run lint
npm run check
npm run build
```

Если части скриптов нет в `package.json`, не выдумывай результат: выполни
имеющиеся проверки и укажи, чего нет.

Обязательная ручная матрица:

| Сценарий | Ожидаемый результат |
|---|---|
| Новый пользователь | регистрация успешна |
| Регистрация с auto-login | токены сохранены, открыт кабинет |
| Email verification | показано сообщение, кабинет не открыт |
| Верный login | три auth-ключа сохранены, открыт кабинет |
| Неверный пароль | форма остаётся, показана понятная ошибка |
| Повтор email | показана ошибка уникальности |
| Перезагрузка кабинета | сессия восстановлена |
| Авторизованный открывает login | редирект в кабинет без показа формы |
| Гость открывает protected route | редирект на login |
| Истёк access token | SDK использует refresh token |
| Невалидный refresh token | сессия не считается активной |
| Logout online | `/auth/logout`, ключи удалены, открыт login |
| Logout при ошибке API | ключи всё равно удалены, открыт login |
| Двойной клик logout | только одна операция |
| Кнопка «Назад» после входа | auth-страница не появляется |

В DevTools проверь:

- URL запросов указывает на нужный Directus;
- login использует `mode: json`;
- authenticated request содержит `Authorization: Bearer ...`;
- токен не попадает в URL и логи;
- CORS разрешает localhost и production origin;
- после logout три ключа отсутствуют.

## 10. Типовые ошибки

| Симптом | Причина | Исправление |
|---|---|---|
| CORS error | origin не разрешён в Directus | настроить `CORS_ENABLED` и точный `CORS_ORIGIN` |
| `INVALID_CREDENTIALS` после signup | включено подтверждение email | отключить auto-login, показать verification flow |
| После reload пользователь разлогинен | storage не восстанавливает refresh/expiry | использовать общий adapter из шаблона |
| Авторизованный видит форму login | нет GuestOnlyGuard или проверяется только DOM state | проверить сессию через `getToken` + `readMe` |
| Гость видит кабинет | нет ProtectedPageGuard | добавить guard и не отдавать секреты в static HTML |
| Logout ведёт на 404 | остался `/site/logout` | заменить legacy route на `LogoutButton` |
| Logout не очищает токены | очистка стоит только после успешного API | перенести `setToken(null)` в `finally` |
| Назад открывает login | используется `assign`/`href` | использовать `location.replace` |
| Несколько запросов login | React и legacy JS слушают одну форму | удалить старый обработчик или изолировать React-зону |

## 11. Эталон MySimpleEnglish

Фактическая реализация, на которой основан навык:

- `src/lib/directus.ts`;
- `src/hooks/useDirectusAuth.ts`;
- `src/components/forms/AuthForm.tsx`;
- `src/pages/index.astro`;
- `src/components/shared/header/Header.astro`.

Переноси контракт и поток данных, а не CSS и тексты конкретного проекта.
