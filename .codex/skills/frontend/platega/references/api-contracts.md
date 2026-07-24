# Platega API: проверенные контракты

Снимок проверен по официальной документации 2026-07-23. Перед изменением кода
сверяй актуальные страницы: API и доступные merchant methods могут меняться.

## Авторизация

- Base URL: `https://app.platega.io/`
- Основной API: `X-MerchantId` и `X-Secret`
- Формат: HTTPS + JSON
- Payout API: отдельный `PG-HMAC`, см. [`payouts.md`](./payouts.md)

Источник: [Авторизация](https://docs.platega.io/).

## SDK и CMS

Официальная [SDK-страница](https://docs.platega.io/sdk-1991993m0.md) на дату
проверки перечисляет PHP SDK и Python SDK. Официальный JavaScript/TypeScript
SDK там не указан.

Страница [CMS-модулей](https://docs.platega.io/%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D0%B8-cms-1991884m0.md)
перечисляет готовые интеграции для ряда CMS. Перед установкой проверяй
происхождение архива, совместимость версии, server-side хранение credentials,
callback auth и идемпотентность. Для custom Astro/Node проекта CMS-модуль не
заменяет backend payment service.

## Платежи

| Назначение | Метод и путь | Важное |
|---|---|---|
| Ссылка с заданным способом | `POST /transaction/process` | Передаётся `paymentMethod`; не передавать `id`; ответ содержит `redirect` |
| Форма с выбором способа | `POST /v2/transaction/process` | `paymentMethod` не передаётся; не передавать `id`; ответ содержит `url` |
| Статус | `GET /transaction/{id}` | Использовать для reconciliation |
| H2H QR | `GET /h2h/{id}` | Возвращает QR/ссылку для H2H-транзакции |

Создание с методом:
[официальная страница](https://docs.platega.io/%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%BD%D0%BE%D0%B9-%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8-%D1%81-%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC-%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%BE%D0%BC-29203843e0.md).

Создание без метода:
[официальная страница](https://docs.platega.io/%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%BD%D0%BE%D0%B9-%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8-%D0%B1%D0%B5%D0%B7-%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE-%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%B0-33845703e0.md).

Статус:
[официальная страница](https://docs.platega.io/%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0-%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D0%B0-%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D1%8B-%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%B0-29203844e0.md).

### Create body

Для фиксированного метода:

```json
{
  "paymentMethod": 2,
  "paymentDetails": {
    "amount": 500,
    "currency": "RUB"
  },
  "description": "Оплата заказа",
  "return": "https://example.com/payment/success",
  "failedUrl": "https://example.com/payment/failed",
  "payload": "opaque-local-token",
  "metadata": {
    "userId": "stable-provider-user-id"
  }
}
```

Для общей формы тело такое же, но без `paymentMethod`.

`metadata.userId` обязателен для отдельных категорий магазинов. Не угадывай
необходимость: зафиксируй её с менеджером Platega. Отсутствие обязательного
`metadata.userId`, согласно документации, отключает антифрод и может привести
к отключению магазина.

### Известные статусы

На текущих страницах подтверждены:

- `PENDING`;
- `CONFIRMED`;
- `CANCELED`;
- `CHARGEBACKED`.

Страницы enum-схем показывают только один пример, а не надёжный полный список.
Типы должны допускать неизвестную строку, но бизнес-логика — помещать её в
quarantine, а не принимать за success.

### Способы оплаты

В текущих примерах встречаются:

- `2` — SBP QR;
- `6` — рекуррентная СБП-подписка;
- `13` — криптоплатёж, упомянутый в примечании о redirect.

Не создавай полный enum по этим трём значениям. Список включённых способов и
их numeric IDs уточняется по актуальной документации и merchant account.

## Callback обычного платежа

Provider отправляет:

```json
{
  "id": "provider-transaction-id",
  "amount": 1000,
  "currency": "RUB",
  "status": "CONFIRMED",
  "paymentMethod": 2
}
```

Заголовки: `X-MerchantId`, `X-Secret`, `Content-Type: application/json`.

Callback URL:

- только HTTPS;
- публичный IP/домен;
- доверенный SSL certificate;
- не localhost, loopback, private IP и не self-signed certificate.

Timeout — 60 секунд. При отсутствии успешного ответа Platega делает до трёх
повторов с интервалом 5 минут.

Источник:
[Callback статуса транзакции](https://docs.platega.io/callback-%D0%BE%D0%B1-%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B8-%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D0%B0-%D1%82%D1%80%D0%B0%D0%BD%D0%B7%D0%B0%D0%BA%D1%86%D0%B8%D0%B8-29209725e0.md).

## Рекуррентные СБП-подписки

### Создание

`POST /transaction/process`:

```json
{
  "paymentMethod": 6,
  "paymentDetails": {
    "amount": 500,
    "currency": "RUB",
    "interval": 3
  },
  "description": "Premium подписка"
}
```

Ответ содержит `paymentMethod: "Subscription"`, `transactionId`, `redirect`,
`status` и `merchantId`.

Документация прямо говорит, что денежная транзакция при создании не возникает:
она появится позже при списании. Поэтому `transactionId` из create response
храни как provider subscription ID в контексте этой операции.

Значение `interval: 3` показано в примере, а detail response отображает
`intervalUnit: "Month"`. При этом schema и list response используют другие
представления. Не строй полный mapping без актуального контракта.

Источник:
[Создать подписку](https://docs.platega.io/%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D1%82%D1%8C-%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D1%83-40029698e0.md).

### Получение, список, отмена

| Операция | Метод и путь |
|---|---|
| Получить | `GET /subscription/{subscriptionId}` |
| Список | `GET /subscription?status=&from=&to=&page=&size=` |
| Отменить | `POST /subscription/{subscriptionId}/cancel` |

Cancel endpoint идемпотентен. Плательщик также может отменить подписку по
ссылке из email, что приходит как `SUBSCRIPTION_CANCELLED`.

Источники:
[получить](https://docs.platega.io/%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C-%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D1%83-40029717e0.md),
[список](https://docs.platega.io/%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-40029720e0.md),
[отмена](https://docs.platega.io/%D0%BE%D1%82%D0%BC%D0%B5%D0%BD%D0%B8%D1%82%D1%8C-%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D1%83-40029730e0.md).

### Callback списания

```json
{
  "Id": "charge-transaction-id",
  "Amount": 100,
  "Currency": "RUB",
  "Status": "CONFIRMED",
  "PaymentMethod": 6,
  "Payload": "",
  "SubscriptionId": "provider-subscription-id",
  "NextChargeAt": "2026-08-09T09:10:00Z"
}
```

Источник:
[Callback списания](https://docs.platega.io/callback-%D0%BF%D0%BE-%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8E-40029713e0.md).

### Callback статуса подписки

Структура похожа на callback списания, но `Id` равен subscription ID, а статус
описывает подписку, например `SUBSCRIPTION_ACTIVATED`.

```json
{
  "Id": "provider-subscription-id",
  "Amount": 100,
  "Currency": "RUB",
  "Status": "SUBSCRIPTION_ACTIVATED",
  "PaymentMethod": 6,
  "Payload": "",
  "SubscriptionId": "provider-subscription-id",
  "NextChargeAt": "2026-08-09T09:10:00Z"
}
```

Источник:
[Callback статуса подписки](https://docs.platega.io/callback-%D0%BF%D0%BE-%D1%81%D1%82%D0%B0%D1%82%D1%83%D1%81%D1%83-%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D0%B8-40030962e0.md).

## Отчёты, баланс, конвертации

| Операция | Метод и путь |
|---|---|
| CSV | `POST /transaction/export/csv` |
| Excel | `POST /transaction/export/excel` |
| JSON | `POST /transaction/export/json` |
| Балансы | `GET /balance/all` |
| Конвертации | `GET /transaction/balance-unlock-operations` |

Экспорт принимает filters `statuses`, `paymentMethods`, `from`, `to`,
`timeZoneId`. CSV/Excel возвращают объект с URL; JSON-страница документации
показывает массив записей, несмотря на формулировку о ссылке. Не объединяй эти
responses в один жёсткий тип.

## Возвраты

| Операция | Метод и путь |
|---|---|
| Проверить возможность | `GET /transaction/{id}/cancel-supported` |
| Инициировать | `POST /transaction/{id}/cancel` |

`cancel-supported` может вернуть `supported`, `totalDeductUsdt`, penalty
fields и `blockReason`. Cancel response может содержать `accepted: false`
вместе с `manualControlRequired: true` и сообщением «в процессе».

Источники:
[проверка](https://docs.platega.io/%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0-%D0%B2%D0%BE%D0%B7%D0%BC%D0%BE%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D0%BE%D1%82%D0%BC%D0%B5%D0%BD%D1%8B-%D1%82%D1%80%D0%B0%D0%BD%D0%B7%D0%B0%D0%BA%D1%86%D0%B8%D0%B8-38219023e0.md),
[отмена](https://docs.platega.io/%D0%BE%D1%82%D0%BC%D0%B5%D0%BD%D0%B0-%D1%82%D1%80%D0%B0%D0%BD%D0%B7%D0%B0%D0%BA%D1%86%D0%B8%D0%B8-38225949e0.md).

## Известные несовпадения документации

- Enum pages отображают один пример и не доказывают полный список.
- Transaction detail содержит wire-поля `mechantId` и `comission` с
  опечатками. Не исправляй ключи до границы нормализации.
- Fixed create response использует `redirect`, choice create — `url`.
- Subscription detail возвращает строковые status/intervalUnit, список —
  numeric representation.
- Обычный callback использует camelCase, subscription callback — PascalCase.
- Subscription create называет ID `transactionId`, хотя денежной транзакции
  на этом шаге нет.
- Export JSON response не совпадает с текстом «возвращает ссылку».

Из-за этого валидируй ответы на runtime, сохраняй неизвестные значения и
нормализуй wire DTO в отдельную доменную модель.

Суммы храни и сравнивай точным decimal-типом с правилами точности валюты.
JavaScript `number` допустим на wire boundary, но не как единственный формат
бухгалтерского сравнения.
