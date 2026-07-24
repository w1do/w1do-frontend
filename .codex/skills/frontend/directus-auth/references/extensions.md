# Дополнительные сценарии Directus Auth

Эти сценарии не входят в базовую копию MySimpleEnglish. Добавляй их отдельными
hooks/components только когда они есть в требованиях проекта.

## 1. Запрос сброса пароля

SDK:

```ts
import { passwordRequest } from '@directus/sdk';
import { directus } from '../lib/directus';

await directus.request(
  passwordRequest(
    email.trim(),
    'https://example.com/auth/reset-password'
  )
);
```

Directus:

```dotenv
PASSWORD_RESET_URL_ALLOW_LIST=https://example.com/auth/reset-password,http://localhost:4321/auth/reset-password
```

Требования:

- всегда показывать нейтральное сообщение, не раскрывая существование email;
- не логировать email и reset token;
- production URL использует HTTPS;
- reset URL входит в allow list.

## 2. Установка нового пароля

Directus добавляет token к reset URL. На странице нового пароля прочитай token
из query string и отправь:

```ts
import { passwordReset } from '@directus/sdk';
import { directus } from '../lib/directus';

await directus.request(passwordReset(token, newPassword));
```

После успеха:

1. удалить token из browser history через redirect/replace;
2. отправить пользователя на login;
3. не выполнять автоматический login без отдельного требования.

## 3. Подтверждение регистрации

Если frontend передаёт `verification_url` при регистрации, он должен входить в
`USER_REGISTER_URL_ALLOW_LIST`.

Страница подтверждения получает token и вызывает:

```ts
import { registerUserVerify } from '@directus/sdk';
import { directus } from '../lib/directus';

await directus.request(registerUserVerify(token));
```

После успеха перенаправь на login с понятным сообщением. Не сохраняй
verification token.

## 4. Профиль текущего пользователя

Чтение:

```ts
import { readMe } from '@directus/sdk';

const me = await directus.request(
  readMe({ fields: ['id', 'email', 'first_name'] })
);
```

Обновление:

```ts
import { updateMe } from '@directus/sdk';

await directus.request(
  updateMe({ first_name: normalizedFirstName })
);
```

Запрашивай только нужные поля. Permissions пользователя должны отдельно
ограничивать чтение и изменение профиля.

## 5. MFA и SSO

MFA добавляет поле OTP к login flow. SSO/OAuth может использовать browser
redirect и callback вместо обычной React-формы.

Не расширяй базовый `AuthForm` десятками условных веток. Для MFA/SSO:

- сначала зафиксируй провайдера и callback URL;
- проверь официальную документацию текущей версии Directus;
- создай отдельный hook/компонент;
- добавь отдельную тестовую матрицу;
- пересмотри способ хранения токенов и CSRF-модель.

## 6. Официальные ссылки

- Authentication API:
  <https://docs.directus.io/reference/authentication>
- Users API:
  <https://docs.directus.io/reference/system/users>
- Security variables:
  <https://docs.directus.io/self-hosted/config-options#security>

