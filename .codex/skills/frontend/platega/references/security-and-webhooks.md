# Безопасность, callback-и и идемпотентность Platega

## Граница доверия

Браузер не имеет права:

- знать merchant secret;
- выбирать итоговую сумму или currency;
- подтверждать оплату;
- назначать user ID для чужого заказа;
- отменять транзакцию напрямую у provider;
- вызывать Payout.

Frontend передаёт server-side product/plan ID. Backend заново авторизует
пользователя и получает коммерческие параметры из доверенного каталога.

## Секреты

- Храни `PLATEGA_MERCHANT_ID` и `PLATEGA_SECRET` в secret manager/runtime env.
- Не используй public env prefixes.
- Не печатай request headers целиком.
- Не вставляй secrets в URL/query.
- Разделяй production/test credentials.
- Ротация должна поддерживать короткое окно двух callback secrets, если это
  допускает процесс поставщика.
- Credential-подобные значения из docs/examples считать недоверенными и
  никогда не переносить в код.

## Проверка callback

В текущей документации callback аутентифицируется `X-MerchantId` и
`X-Secret`; отдельная криптографическая подпись callback не описана.

Обязательно:

1. Сравнить merchant ID и secret constant-time.
2. Использовать только ожидаемый merchant ID.
3. Валидировать конкретную JSON-схему endpoint-а.
4. Искать объект по provider ID, который был сохранён при create response.
5. Сверять amount и currency с локальным заказом/планом. Сумму сравнивать как
   точный decimal после нормализации валютной точности.
6. Не доверять `payload` как разрешению на операцию.
7. Не создавать заказ из неизвестного callback.

Не придумывай IP allowlist: используй её только после получения официального
и поддерживаемого Platega списка адресов.

## Три endpoint-а

Рекомендуется:

```text
POST /api/webhooks/platega/payment
POST /api/webhooks/platega/subscription-charge
POST /api/webhooks/platega/subscription-status
```

Это позволяет выбрать точную схему до бизнес-обработки и не спутать:

- transaction `id`;
- charge transaction `Id`;
- subscription `Id`;
- `SubscriptionId`.

## Dedupe keys

В callback payload нет отдельного event ID. Создавай стабильный ключ из
контекста:

```text
payment:{transactionId}:{status}
subscription-charge:{chargeTransactionId}:{status}
subscription-status:{subscriptionId}:{status}
```

Если один и тот же объект может законно прислать одинаковый статус повторно с
новыми данными, сохраняй raw event fingerprint отдельно, но бизнес-эффект
всё равно защищай уникальным ключом операции:

```text
grant:{orderId}
renew:{providerChargeTransactionId}
revoke:{providerTransactionId}:chargeback
```

## DB-транзакция и outbox

В одной транзакции:

1. `INSERT incoming_event ... ON CONFLICT DO NOTHING`;
2. если duplicate — вернуть success без повторного эффекта;
3. заблокировать payment/subscription row;
4. проверить допустимый state transition;
5. записать новое состояние;
6. вставить outbox job с уникальным business key;
7. commit;
8. вернуть `200`.

Email, Directus update, выдачу контента и аналитику выполняй worker-ом.
Иначе callback может истечь, повториться и продублировать side effect.

## State transitions

Не допускай:

- `CONFIRMED -> PENDING`;
- `CHARGEBACKED -> CONFIRMED` без отдельной ручной процедуры;
- выдачу доступа по неизвестному статусу;
- продление по `NextChargeAt`;
- выдачу доступа по одному `SUBSCRIPTION_ACTIVATED`.

Разрешай:

- `PENDING -> CONFIRMED`;
- `PENDING -> CANCELED`;
- `CONFIRMED -> CHARGEBACKED`;
- повтор текущего статуса как no-op;
- subscription mandate activation отдельно от paid entitlement.

## Ответы callback

- `200`: auth, schema и durable commit успешны; duplicate также успешен.
- `400`: JSON/схема неверны.
- `401`/`403`: merchant/secret неверны.
- `404`: осторожно; для неизвестного provider ID обычно лучше durable
  quarantine + alert, чтобы событие не потерялось.
- `409`: не использовать для обычного duplicate.
- `5xx`: временная инфраструктурная ошибка; разрешить provider retry.

Для callback обычного платежа Platega документирует timeout 60 секунд и до
трёх retry через 5 минут. Целевой callback latency должен быть существенно
меньше. Для subscription callback точную retry-политику нужно подтвердить, но
идемпотентность обязательна в любом случае.

## Redirect pages

Success page:

- показывает «проверяю оплату»;
- запрашивает локальный payment status у backend;
- не принимает `status=success` из query как факт;
- умеет показать pending и повторить polling с ограничением;
- не вызывает выдачу доступа.

Failed page также не меняет server state: callback может прийти позже или
пользователь мог открыть URL вручную.

## Reconciliation

Периодическая задача выбирает:

- слишком долгие `PENDING`;
- `CREATE_UNKNOWN`;
- callback schema quarantine;
- subscription с просроченным expected charge;
- refund/manual review.

Для известных transaction IDs вызывай `GET /transaction/{id}`, сравнивай
provider state с локальным и применяй те же state transition handlers, что и
callback. Не делай отдельную «упрощённую» выдачу доступа.

## Защита create endpoint

- Требуй пользовательскую сессию.
- CSRF-защита нужна при cookie auth.
- Добавь rate limit по user/order/IP.
- Используй checkout attempt nonce или single-flight lock.
- Цена и plan всегда server-side.
- Ограничь description/payload length.
- Return URLs бери из конфигурации, не из request body.
- Разрешай redirect только на ожидаемый HTTPS host.
- Не делай blind retry POST create.
