## 1. Зависимость и конфиг

- [x] 1.1 Добавить `"redis": "6.3.0"` в `dependencies` в `package.json` и выполнить `npm install`
- [x] 1.2 Добавить `REDIS_URL` (secret, optional) в `env.schema` в `astro.config.mjs`

## 2. Общая функция заявки

- [x] 2.1 Создать `src/lib/server/leads/submit-lead.ts`
- [x] 2.2 Переписать `src/pages/api/lead.ts` на `submitLead` без изменения контракта

## 3. Черновик, лимиты, тесты

- [x] 3.1 Изменить `src/lib/chat.ts`: типы, `CHAT_ID_PATTERN`, `CHAT_LEAD_*`, история 12, хранение 40, тело 8 000 символов
- [x] 3.2 Создать `src/lib/server/chat/lead-directives.ts`
- [x] 3.3 Перевести `rate-limit.ts` на `createLimiter` и добавить `checkLeadLimit` (в памяти)
- [x] 3.4 Создать `tests/chat-lead.test.ts`, запустить `node --experimental-strip-types --test tests/*.test.ts`

## 4. Redis

- [x] 4.1 Создать `src/lib/server/redis.ts`: ленивое подключение, `disableOfflineQueue`, таймауты, `RedisUnavailableError`, лог без URL
- [x] 4.2 Создать `src/lib/server/chat/chat-store.ts`: `chat:ctx:<id>` с TTL 24 ч, `claimLeadPhone` и `releaseLeadPhone`

## 5. Сервер чата

- [x] 5.1 Создать `src/lib/server/chat/chat-request.ts`
- [x] 5.2 Обновить правила 4, 6, 7 и «Состояние диалога» в `system-prompt.ts`
- [x] 5.3 Создать `src/lib/server/chat/chat-lead.ts`
- [x] 5.4 Перевести `src/pages/api/chat.ts` на `chatId` и состояние в Redis
- [x] 5.5 Создать `src/pages/api/chat-lead.ts`

## 6. Клиент

- [x] 6.1 Экспортировать `collectPayload` из `useContactForm.ts`
- [x] 6.2 Обновить `useAiChat.ts`: `chatId`, отправка без истории, согласие, черновик, подтверждение
- [x] 6.3 Создать `ChatConsent.tsx` и `ChatLeadCard.tsx`, обновить `AiChat.tsx`
- [x] 6.4 Создать `src/styles/ai-chat.css`, перенести стили из `chat.astro`
- [x] 6.5 Создать `ChatWidget.tsx`, заменить форму в `Cta.astro`, удалить `CtaForm.tsx`

## 7. Проверка

- [ ] 7.1 `npm run build`, unit-тесты, `grep -rl "X-Api-Key\|polza.ai\|redis://" dist/client` возвращает пусто
- [ ] 7.2 Регрессия `/api/lead` L1–L7 (L1 с `LEADS_API_KEY=test` → 502)
- [ ] 7.3 R1: `REDIS_URL=redis://127.0.0.1:6399` → 503 в обоих роутах, в логе `[chat] redis unavailable` без URL
- [ ] 7.4 W3, W8, W9 без модели
- [ ] 7.5 R2 и C1–C5 с настоящим `POLZA_AI_API_KEY` (без ключа указать «не запускалось»)
- [ ] 7.6 Браузер 1440 и 375 px: виджет на страницах из инвентаризации, `/contact` с формой, `/chat` без визуальных изменений

## 11. Исправления после security review (см. раздел в `proposal.md`)

- [x] 11.1 `astro.config.mjs`: `TRUSTED_PROXY_HOPS` (default 0), `CHAT_LEAD_HASH_SECRET` (optional)
- [x] 11.2 `src/lib/chat.ts`: `CHAT_CONSENT_VERSION`, `CHAT_CONSENT_NOTICE`, `CHAT_BUSY_MESSAGE`
- [x] 11.3 Создать `src/lib/server/chat/chat-state.ts`: `ChatKv`, состояние с `createdAt`, EXAT, блокировка, согласие, `redactAfterLead`
- [x] 11.4 `redis.ts`: отказ без пароля, `getChatKv()` (EXAT, PX+NX, EVAL compare-and-delete)
- [x] 11.5 `chat-store.ts`: только маркер телефона с HMAC
- [x] 11.6 `rate-limit.ts`: `clientKeyFrom(request, clientAddress, trustedProxyHops)`
- [x] 11.7 `lead-directives.ts`: имя от 2 символов, совпадение целым словом и токеном, исключение автотекста согласия
- [x] 11.8 `submit-lead.ts`: `reason` в отказе, лог без `details`
- [x] 11.9 `chat-lead.ts`: порядок захват маркера → лимит; маркер при сетевой ошибке остаётся; версия и отпечаток согласия в `payload`
- [x] 11.10 `api/chat.ts` и `api/chat-lead.ts`: блокировка (409), `loadState`/`saveState`, `acceptConsent` только после запроса, `redactAfterLead`
- [x] 11.11 `ChatConsent.tsx`: текст из `CHAT_CONSENT_NOTICE`
- [x] 11.12 Тесты: новый `tests/chat-state.test.ts` (M1, M2, M4), дополнить `tests/chat-lead.test.ts` (M3, L1)
- [ ] 11.13 Smoke: R3 (без пароля → 503), R4 (параллельные запросы → 409, с ключом модели), M1 через curl, L1 без `details=` в логе
- [ ] 11.14 (человек) D1 `TRUSTED_PROXY_HOPS`, D2 `CHAT_LEAD_HASH_SECRET`, D3 `maxmemory-policy noeviction`, D4 `REDIS_URL` с паролем и доступный из контейнера
- [ ] 11.15 Не делается: тесты роутов с поддельным Redis (`astro:env` недоступен под `node --test`), покрыто unit-тестами `chat-state.ts` и smoke-тестами

## 8. Память проекта

- [ ] 8.1 `memory_update` по созданным и изменённым файлам, `memory_sync` после удаления `CtaForm.tsx`, `memory_annotate` для новых файлов
- [ ] 8.2 `memory_status`: 0 stale, 0 unindexed, 0 errors

## 9. Документация (documenter, после APPROVED)

- [x] 9.1 README: виджет вместо CTA-формы, `/api/chat-lead`, Redis, `REDIS_URL`, поля заявки из чата
- [ ] 9.2 Формулировки `description` и `pageSeo["/chat"]`: заявка оформляется в чате

## 10. Перед выкладкой (человек)

- [ ] 10.1 Дополнить `/docs/privacy-policy` и `/docs/personal-data-consent`: сообщения чата обрабатывает ИИ-сервис PolzaAI, переписка хранится на сервере до 24 часов
- [ ] 10.2 Проверить, что `REDIS_URL` в продакшене доступен из контейнера сайта (не `127.0.0.1` контейнера) и содержит пароль
- [ ] 10.3 Убедиться, что Redis не доступен извне и пароль не попадает в логи и CI
- [ ] 10.4 Одна настоящая заявка через виджет: в платформе `source: chat-widget`, резюме в `message`, `payload.legal_consent_at`; в Redis ключ `chat:ctx:*` с TTL не больше 86 400
- [ ] 10.5 Учесть в отчётах платформы замену `cta-block` на `chat-widget` и `chat-page`

## 12. Исправления после проверки (follow-up)

- [x] 12.1 F1: при `TRUSTED_PROXY_HOPS=0` и присутствующем `X-Forwarded-For` клиентам назначается общий ключ лимита (исправление подтверждено в отчёте)
- [x] 12.2 F2: best-effort удаление состояния диалога после отправленной заявки
- [x] 12.3 Исправление черновика заявки: валидный черновик сохраняется, когда последующий `<lead>` отклонён
- [x] 12.4 Правка промпта: имя, телефон и задача берутся из собственных сообщений посетителя до `<lead>`
- [x] 12.5 Опция сборки `ASSETS_PREFIX`

## Открытые пункты (не отмечены, причины)

- 7.1–7.4: в отчёте о проверках нет подтверждения, отметка не ставится
- 7.5: R2 подтверждён вручную на локальном compose; C1–C5 не указаны в отчёте
- 7.6: браузерная проверка 1440 и 375 px не выполнена
- 9.2: формулировки `description` и `pageSeo["/chat"]` про оформление заявки в чате не сверены
- 10.1–10.5: выкладка и действия человека (юридические тексты, прод-окружение Redis, реальная заявка, проверка в платформе)
- 11.13: в отчёте подтверждены R2, TTL ключей `chat:ctx:*` (около 24 ч) и отказ 400 без согласия; R3, R4, M1 и L1 не подтверждены
- 11.14: действия человека D1–D4 (`TRUSTED_PROXY_HOPS`, `CHAT_LEAD_HASH_SECRET`, `maxmemory-policy noeviction`, `REDIS_URL` с паролем)
- 11.15: не делается (см. текст пункта)
- 8.1–8.2: память проекта обновляется отдельно, после этой правки
