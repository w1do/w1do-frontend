# Безопасность и граница клиентской авторизации

## 1. Что обеспечивает этот навык

Шаблоны реализуют удобную browser-сессию:

- login/signup;
- хранение и refresh токенов;
- проверку `/users/me`;
- клиентские редиректы;
- очистку при logout.

Они не превращают статическую Astro-страницу в серверно защищённый маршрут.

## 2. Почему middleware не видит сессию

`localStorage` существует только в браузере. Когда Astro middleware обрабатывает
HTTP request, значения `directus_access_token` и `directus_refresh_token` в
request отсутствуют.

Следствия:

- middleware не может выполнить серверный redirect по этим токенам;
- prerendered HTML уже создан до browser guard;
- секретные данные нельзя встраивать в HTML защищённой страницы;
- protected guard отвечает за UX, а не за права на API.

## 3. Реальная защита данных

Данные защищают Directus roles и policies. Каждый запрос к приватной коллекции
должен выполняться с access token, а Directus должен отклонять запросы Public
role.

Даже если пользователь отключил JavaScript или удалил guard, он не должен
получить приватные записи.

## 4. Риск localStorage

Официальная документация Directus показывает custom localStorage как пример,
но не рекомендует хранить browser credentials таким способом в production.
Причина: любой JavaScript, выполняющийся на origin после XSS, может прочитать
токены.

Минимальные меры:

- строгая Content Security Policy;
- отсутствие `eval` и небезопасных inline-скриптов;
- санитизация пользовательского HTML;
- аудит сторонних скриптов;
- короткое время жизни access token;
- минимальные permissions роли;
- отсутствие токенов в логах, URL и analytics.

Официальный SDK auth guide:
<https://docs.directus.io/guides/sdk/authentication#configure-custom-storage>.

## 5. Когда нужен cookie/SSR вариант

Выбирай серверную архитектуру, если:

- страницы содержат приватный SSR HTML;
- middleware обязан блокировать request до рендера;
- приложение работает с чувствительными персональными или финансовыми данными;
- требования запрещают JavaScript-доступ к refresh token;
- нужен единый серверный session lifecycle.

Предпочтительная схема:

```text
Browser
  -> Astro server/BFF
      -> Directus

Browser получает только HttpOnly + Secure + SameSite cookie.
Directus tokens хранятся и обновляются на сервере.
Middleware читает серверную cookie/session и делает redirect до рендера.
```

Это отдельная архитектура. Не пытайся сделать её частично, просто заменив
`localStorage` на `document.cookie`: cookie без `HttpOnly` сохраняет XSS-риск,
а cross-domain cookies требуют корректных `credentials`, CORS, SameSite и
Secure.

Для прямых cross-domain cookies Directus SDK использует:

```ts
createDirectus(url)
  .with(authentication('cookie', { credentials: 'include' }))
  .with(rest({ credentials: 'include' }));
```

Перед внедрением проверь доменную схему и CSRF-модель.

Официальный раздел cross-domain cookies:
<https://docs.directus.io/guides/sdk/authentication#cross-domain-cookies>.

## 6. Guards и отказоустойчивость

Guard должен:

- скрывать страницу только пока идёт проверка;
- иметь ограниченный timeout;
- снимать скрытие при ошибке API;
- использовать `replace`, а не создавать redirect loop;
- не считать наличие строки в `localStorage` достаточной проверкой;
- подтверждать access token через `/users/me`.

Если Directus недоступен:

- guest-only page может показать login после timeout;
- protected page должна отправить на login;
- приватные данные всё равно не должны быть встроены в static HTML.

