# Platega Payout API

Payout доступен только после отдельного подключения у менеджера. Секрет
показывается один раз и после сброса немедленно инвалидирует старый.

Официальные страницы:

- [Вывод на рублёвую карту](https://docs.platega.io/%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D1%91%D1%82-%D0%B2%D1%8B%D0%B2%D0%BE%D0%B4-%D0%BD%D0%B0-%D1%80%D1%83%D0%B1%D0%BB%D1%91%D0%B2%D1%83%D1%8E-%D0%BA%D0%B0%D1%80%D1%82%D1%83-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-payout-api-2232954m0.md)
- [Сохранённые карты](https://docs.platega.io/%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D1%8B%D1%85-%D0%BA%D0%B0%D1%80%D1%82-39075563e0.md)

## Подпись POST

Строка состоит из пяти строк:

```text
METHOD
PATH
timestamp
idempotency-key
sha256_hex(body)
```

Подпись:

```text
Base64(HMAC-SHA256(SECRET, string_to_sign))
```

Authorization:

```text
PG-HMAC kid={MERCHANT_ID}, ts={timestamp}, sig={signature}
```

Дополнительно передаётся `Idempotency-Key`.

Критично: JSON сериализуется ровно один раз. Те же bytes используются для
SHA-256 и HTTP body. Не перестраивай объект после вычисления подписи.

`timestamp` — Unix seconds, допустимое окно ±300 секунд. Серверы должны иметь
синхронизированное время.

## Создание вывода

`POST /api/v1/payouts/card-rub`

```json
{
  "cardId": "saved-card-id",
  "amountRub": 1500,
  "payoutMethod": "CARD",
  "currencyRequested": "RUB"
}
```

Вместо `cardId` может передаваться `cardNumber`, но предпочитай сохранённую
карту. По текущей документации сумма одного вывода — от 1000 до 87500 RUB.

Для новой выплаты создай новый idempotency key. Для retry той же выплаты
используй тот же key и идентичное body. Никогда не генерируй новый key внутри
автоматического retry loop.

## Получение карт

`GET /api/v1/cards?onlyActive=true`

Для GET строка подписи:

```text
GET
/api/v1/cards
timestamp

e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

Четвёртая строка пустая: idempotency key для GET не используется. Последняя
строка — SHA-256 пустого body.

## Контроль риска

- отдельная service identity и secret;
- запрет Payout из пользовательского frontend;
- явная операторская авторизация;
- лимиты на одну операцию, сутки, пользователя и карту;
- approval для аномальных сумм/новых карт;
- immutable audit log;
- masked PAN в UI и логах;
- raw PAN не хранить без отдельного PCI-scoped решения;
- алерт на повторные, частые и отклонённые выплаты;
- reconciliation по `withdrawalRecordId`;
- ручной runbook для `CREATED`/неизвестного длительного состояния.

