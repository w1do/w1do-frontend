---
name: platega
description: >
  Универсальная безопасная интеграция Platega.io: разовые платежи, платёжные
  ссылки, проверка статуса, callback-и, рекуррентные СБП-подписки, возвраты,
  балансы, выгрузки и Payout API. Используй навык при подключении, переносе,
  аудите или исправлении Platega в любом backend/BFF, включая Astro SSR.
---

# Platega.io: универсальная интеграция

Этот навык задаёт переносимую архитектуру интеграции Platega. Он не привязан к
конкретной базе данных или web-фреймворку. TypeScript-шаблоны в
[`templates/`](./templates/) рассчитаны на серверный runtime Node.js и
показывают границы клиента, callback-парсера и Payout-подписи.

Перед реализацией открой актуальную
[документацию Platega](https://docs.platega.io/) и
[`llms.txt`](https://docs.platega.io/llms.txt). API меняется, а отдельные
страницы документации содержат неполные enum-схемы и несовпадающие формы
ответов. Зафиксированный снимок контрактов находится в
[`references/api-contracts.md`](./references/api-contracts.md).

## 1. Когда использовать

Подключай навык, если задача включает хотя бы один пункт:

- создание платёжной ссылки Platega;
- выбор конкретного метода оплаты или общей платёжной формы;
- проверку статуса транзакции или H2H QR;
- callback обычного платежа;
- СБП-подписку, callback списания или статуса подписки;
- отмену подписки;
- возврат или отмену транзакции;
- выгрузку операций, баланс или конвертации;
- сохранённые карты и вывод через Payout API;
- перенос, аудит безопасности или диагностику существующей интеграции.

Не используй API Platega непосредственно из браузера. Для статического сайта
создай отдельный backend/BFF/serverless API или осознанно переведи приложение
на runtime, поддерживающий серверные маршруты.

## 2. Неподвижные правила

1. `X-MerchantId`, `X-Secret` и Payout `SECRET` существуют только на сервере.
   Не используй префиксы `PUBLIC_`, `VITE_`, `NEXT_PUBLIC_` и аналоги.
2. Все запросы к Platega идут по HTTPS через один серверный клиент.
3. Сумма, валюта, тариф, период и пользователь определяются сервером. Браузер
   передаёт только идентификатор разрешённого продукта/тарифа.
4. При создании платежа не передавай поле `id`: его генерирует Platega.
5. Success/failed redirect сообщает только о навигации. Он не подтверждает
   оплату и не изменяет доступ пользователя.
6. Источник истины — проверенный callback, дополненный серверным запросом
   `GET /transaction/{id}` при восстановлении или спорном состоянии.
7. Callback обязан пройти проверку `X-MerchantId` и `X-Secret`, валидацию тела,
   сверку суммы/валюты и идемпотентную запись.
8. `CONFIRMED` выдаёт товар или доступ один раз. `CANCELED` не выдаёт доступ.
   `CHARGEBACKED` запускает отдельный сценарий отзыва/долга/ручной проверки.
9. Не трактуй неизвестный статус как успех. Сохрани событие, подними
   наблюдаемое предупреждение и сверь актуальную документацию.
10. Не делай автоматический retry создания платежа: у этой ручки не
    документирован idempotency key, а ID создаёт поставщик. После сетевого
    таймаута результат может быть неоднозначным.
11. Для Payout используется отдельная HMAC-аутентификация и отдельный секрет.
    Не смешивай её с `X-Secret`.
12. Не копируй credential-подобные значения из примеров документации.

## 3. Профиль API

| Часть | Контракт |
|---|---|
| Base URL | `https://app.platega.io/` |
| Обычная auth | `X-MerchantId` + `X-Secret` |
| Платёж с методом | `POST /transaction/process` |
| Выбор метода на форме | `POST /v2/transaction/process` |
| Статус платежа | `GET /transaction/{id}` |
| Подписка | `paymentMethod: 6` через `POST /transaction/process` |
| Callback платежа | JSON + `X-MerchantId` + `X-Secret` |
| Callback списания | отдельный endpoint приложения |
| Callback статуса подписки | отдельный endpoint приложения |
| Payout auth | `PG-HMAC` + `Idempotency-Key` |

Подробная таблица ручек, проверенные примеры полей и замечания о расхождениях:
[`references/api-contracts.md`](./references/api-contracts.md).

Официальная SDK-страница на дату проверки перечисляет PHP и Python, но не
JavaScript/TypeScript. Не называй случайный npm-пакет официальным. Для
Astro/Node используй небольшой серверный HTTP-клиент из шаблона или отдельно
проверенную библиотеку. Готовые CMS-модули применяй только к совпадающей CMS
после проверки источника, версии, callback-логики и хранения secrets.

## 4. Перед реализацией

Сначала выясни и зафиксируй:

1. Где выполняется доверенный серверный код.
2. Какой пользователь и заказ инициируют платёж.
3. Где сервер хранит цены и разрешённые интервалы подписок.
4. Какие способы оплаты включены именно для этого merchant account.
5. Требует ли категория магазина `metadata.userId`.
6. Какие production URL используются для success, failed и трёх callback
   потоков.
7. Есть ли надёжная БД, уникальные ограничения, транзакции и очередь/outbox.
8. Как выдаётся и отзывается платный доступ.
9. Как восстанавливаются пропущенные callback-и.
10. Нужны ли возвраты или Payout; не включай высокорисковые операции «на
    будущее».

Если проект Astro собран только как `output: 'static'`, API routes и секреты
нельзя размещать в статической сборке. Выбери backend/BFF или отдельное
архитектурное изменение режима рендера и deployment adapter.

## 5. Целевая архитектура

```text
browser
  -> POST /api/billing/checkout      (без секретов и произвольной суммы)
  -> backend/BFF
       -> orders/subscriptions DB
       -> Platega server client
       -> возвращает только provider redirect URL

Platega
  -> /api/webhooks/platega/payment
  -> /api/webhooks/platega/subscription-charge
  -> /api/webhooks/platega/subscription-status
       -> auth + schema validation
       -> idempotent DB transaction
       -> outbox/job
       -> HTTP 200

worker/reconciliation
  -> выдача доступа, письма, аналитика
  -> GET /transaction/{id} для восстановления
```

Разделяй слои:

- transport — HTTP, timeout, auth headers, безопасные ошибки;
- application service — тарифы, заказы, переходы состояний;
- repository — атомарная запись и уникальные ограничения;
- webhook adapter — auth, валидация, нормализация;
- entitlement service — выдача/отзыв доступа;
- reconciliation job — восстановление пропущенных событий;
- payout service — отдельная зона прав и аудита.

## 6. Минимальная модель данных

### Платёжная попытка

- локальный `id`;
- `userId` и `orderId`;
- server-side `expectedAmount` в точном decimal-типе и `expectedCurrency`;
- `providerTransactionId` с уникальным индексом;
- `payloadToken` — непрозрачный correlation token, не секрет и не PII;
- `status`, `paymentMethod`;
- `createdAt`, `confirmedAt`, `canceledAt`, `chargebackedAt`;
- версия/поле для optimistic locking.

### Подписка

- локальный `id`, `userId`, `planId`;
- `providerSubscriptionId` с уникальным индексом;
- ожидаемые сумма, валюта и интервал;
- provider status, `nextChargeAt`, `lastChargeAt`;
- `cancelRequestedAt`, `canceledAt`;
- отдельные записи списаний по provider transaction ID.

### Входящее событие

- тип endpoint-а;
- provider object ID;
- provider status;
- вычисленный dedupe key с уникальным индексом;
- безопасная нормализованная копия payload;
- время получения и обработки;
- результат бизнес-перехода.

Не полагайся только на in-memory lock. Уникальность и идемпотентность должны
обеспечиваться БД.

## 7. Разовый платёж

1. Авторизуй пользователя и проверь право покупать выбранный продукт.
2. Получи цену и валюту из серверного каталога.
3. Создай локальную попытку в `CREATING`.
4. Заблокируй повторное создание для того же checkout action.
5. Сформируй:
   - `paymentDetails.amount` и `currency`;
   - безопасное `description`;
   - HTTPS `return` и `failedUrl` из конфигурации;
   - непрозрачный `payload`;
   - `metadata.userId`, если этого требует Platega/категория магазина.
6. Для фиксированного метода вызови `/transaction/process`; для выбора метода
   плательщиком — `/v2/transaction/process`.
7. Сразу сохрани полученный `transactionId`, статус и expiry.
8. Проверь, что redirect URL использует HTTPS и ожидаемый домен Platega.
9. Отдай браузеру только URL и локальный публичный идентификатор попытки.
10. Заверши оплату только через callback/status reconciliation.

После неоднозначного timeout не создавай новую попытку автоматически. Пометь
старую как `CREATE_UNKNOWN`, проверь журнал поставщика/поддержку и разреши
новую попытку только по явной бизнес-политике.

## 8. СБП-подписка

1. Проверь, что рекуррентные СБП-подписки включены у merchant account.
2. Получи сумму и interval из server-side плана.
3. Вызови `/transaction/process` с `paymentMethod: 6`.
4. Сохрани возвращённый `transactionId` как `providerSubscriptionId` в
   контексте подписки. По документации денежная транзакция при создании ещё не
   возникает.
5. Перенаправь пользователя на `redirect` для привязки СБП.
6. `SUBSCRIPTION_ACTIVATED` означает активную привязку, но не подтверждает
   денежное списание.
7. Выдавай оплаченный доступ только по callback списания со статусом
   `CONFIRMED` после сверки суммы, валюты и subscription ID.
8. Не продлевай доступ по одному `NextChargeAt`: это плановая дата, не факт
   успешного платежа.
9. Отмену выполняй через `/subscription/{subscriptionId}/cancel`; ручка
   идемпотентна. Поддерживай и самостоятельную отмену плательщиком через
   `SUBSCRIPTION_CANCELLED`.

Политику grace period после неуспешного рекуррентного списания задаёт продукт,
а не frontend.

## 9. Callback-и

Используй три отдельных маршрута. Это устраняет неоднозначность поля `Id`:

- payment callback: `id` — transaction ID;
- subscription charge callback: `Id` — charge transaction ID,
  `SubscriptionId` — subscription ID;
- subscription status callback: `Id` — subscription ID, не transaction ID.

Порядок обработки:

1. Ограничь метод `POST`, content type и размер тела.
2. Сравни `X-MerchantId` и `X-Secret` с серверной конфигурацией constant-time
   сравнением.
3. Разбери JSON и провалидируй схему конкретного endpoint-а.
4. Найди локальный объект только по ранее сохранённому provider ID.
5. Сверь merchant context, amount, currency и ожидаемый объект.
6. В одной DB-транзакции:
   - вставь событие с dedupe key;
   - примени допустимый переход состояния;
   - создай outbox job;
   - зафиксируй обработку.
7. Верни `200` только после durable commit.
8. Тяжёлую работу выполняй после ответа через очередь/outbox.

Platega ждёт успешный ответ до 60 секунд и при неуспехе выполняет до трёх
повторов с интервалом 5 минут — это явно документировано для callback обычного
платежа. Subscription callback-и также обрабатывай идемпотентно и быстро, но
их точную retry-политику сверяй с Platega.

На неверный secret возвращай `401`/`403`, на неверную схему — `400`, на
временную ошибку БД — `5xx`, чтобы поставщик повторил запрос. Не возвращай
`200`, если событие потеряно.

Полный security-разбор:
[`references/security-and-webhooks.md`](./references/security-and-webhooks.md).

## 10. Состояния и доступ

Не делай свободное присваивание статусов. Используй явную state machine.

Допустимый минимальный смысл:

- `PENDING` — ожидание, доступа нет;
- `CONFIRMED` — успешная оплата, идемпотентная выдача;
- `CANCELED` — оплата не состоялась, доступа нет;
- `CHARGEBACKED` — возврат после оплаты; отдельный отзыв/долг/ручной процесс;
- неизвестный статус — quarantine/reconciliation, никогда не success.

Callback-и могут приходить не по порядку. Терминальное подтверждение нельзя
откатить устаревшим `PENDING`; `CHARGEBACKED` после `CONFIRMED` должен
обрабатываться как новый бизнес-факт.

## 11. Возвраты

1. Авторизуй операторское действие и запиши audit log.
2. Проверь локальный confirmed transaction.
3. Вызови `GET /transaction/{id}/cancel-supported`.
4. Если `supported !== true`, не вызывай cancel и покажи `blockReason`.
5. При поддержке вызови `POST /transaction/{id}/cancel`.
6. Не считай `accepted: false` окончательным отказом, если
   `manualControlRequired: true`.
7. Финальное состояние получай из callback/status и сохраняй отдельно от
   пользовательского redirect.

## 12. Payout

Payout — отдельный высокорисковый контур. Он должен иметь:

- отдельный `PLATEGA_PAYOUT_SECRET`;
- минимальные права и отдельный service;
- operator authorization, 2FA/approval по требованиям продукта;
- immutable audit log;
- лимиты суммы и velocity;
- запрет логирования PAN;
- предпочтение `cardId` вместо полного номера карты;
- NTP-синхронизацию времени;
- явный `Idempotency-Key`, который переиспользуется при retry той же операции.

Точная строка HMAC и требования:
[`references/payouts.md`](./references/payouts.md).

## 13. Перенос TypeScript-шаблонов

Скопируй и адаптируй:

- [`templates/.env.example`](./templates/.env.example);
- [`templates/src/lib/server/platega/types.ts`](./templates/src/lib/server/platega/types.ts);
- [`templates/src/lib/server/platega/client.server.ts`](./templates/src/lib/server/platega/client.server.ts);
- [`templates/src/lib/server/platega/webhook.server.ts`](./templates/src/lib/server/platega/webhook.server.ts);
- [`templates/src/lib/server/platega/payout.server.ts`](./templates/src/lib/server/platega/payout.server.ts).

Шаблоны намеренно не содержат DB и выдачу доступа. Эти части нельзя сделать
универсально без ложной безопасности: подключи repository и entitlement
service проекта явно.

TypeScript DTO не валидирует удалённый JSON. Callback template содержит
runtime-парсер; для используемых API responses добавь Zod, Valibot или
эквивалентные runtime-схемы проекта до бизнес-обработки.

## 14. Наблюдаемость

Логируй структурированно:

- локальный order/subscription ID;
- provider transaction/subscription ID;
- тип операции, endpoint, HTTP status, latency;
- нормализованный provider status;
- dedupe result и state transition.

Не логируй:

- `X-Secret`, Payout `SECRET`, HMAC signature;
- полный callback header dump;
- PAN, email плательщика без необходимости;
- полный request/response body;
- redirect URL с потенциальными query-параметрами;
- raw `payload`, если в нём могут быть пользовательские данные.

Добавь метрики: create success/error/unknown, callback auth failure, duplicate,
processing latency, unknown status, amount mismatch, reconciliation drift,
refund/payout manual review.

## 15. Проверка

Минимальный чек-лист:

1. Секреты отсутствуют в клиентском bundle, HTML, git и `PUBLIC_*`.
2. Сумму нельзя изменить через DevTools.
3. Двойной клик не создаёт две попытки.
4. В create body нет `id`.
5. Оба формата ответа (`redirect` и `url`) обрабатываются раздельно.
6. Redirect не выдаёт доступ.
7. Callback с неверным secret отклоняется.
8. Callback с другой суммой/валютой не выдаёт доступ.
9. Повтор того же callback не дублирует доступ/письмо.
10. Out-of-order callback не откатывает терминальное состояние.
11. Пропущенный callback восстанавливается reconciliation job.
12. Подписка не выдаёт доступ только по `SUBSCRIPTION_ACTIVATED`.
13. Отмена подписки повторяемая и не создаёт ошибочное новое состояние.
14. Возврат проходит через `cancel-supported`.
15. Payout retry использует тот же idempotency key и те же body bytes.
16. В логах нет secrets, PAN и credential headers.
17. Production callback — публичный HTTPS URL с доверенным сертификатом.

После изменения интеграции обнови `.env.example`, deployment docs,
`AGENTS.md`, проектный `SUMMARY.md` и операционную инструкцию по callback URL.
