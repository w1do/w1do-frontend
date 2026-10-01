## 1. Ключи окружения

- [x] 1.1 Добавить в `.env.example` секцию платформы с плейсхолдерами: `LEADS_API_BASE_URL=https://backend.w1do.ru`, `LEADS_API_KEY=pk_live_your_key_here`, `PUBLIC_LEADS_ENDPOINT=/api/lead`; убедиться, что реальный ключ в файле отсутствует (`grep -c 'pk_live_HzKR' .env.example` возвращает 0)
- [x] 1.2 Добавить в `.env` реальные значения `LEADS_API_BASE_URL`, `LEADS_API_KEY` и `PUBLIC_LEADS_ENDPOINT` из `LLM.txt`; убедиться, что `.env` не отслеживается git (`git check-ignore -v .env` печатает правило)
- [x] 1.3 Проверить, что имена серверных ключей не начинаются с `PUBLIC_`, и убедиться после `npm run build`, что `grep -r 'LEADS_API_KEY' dist/client` не даёт совпадений

## 2. Серверный прокси-роут

- [x] 2.1 Создать `src/pages/api/lead.ts` с `export const prerender = false` и обработчиком `POST`; проверить, что при `npm run dev` запрос `curl -X POST localhost:4321/api/lead -H 'Content-Type: application/json' -d '{}'` возвращает ответ роута, а не 404
- [x] 2.2 Реализовать чтение конфигурации: `LEADS_API_KEY` из `import.meta.env`, `LEADS_API_BASE_URL` со значением по умолчанию `https://backend.w1do.ru`; проверить, что при пустом `LEADS_API_KEY` роут отвечает 500 с нейтральным текстом, пишет явное сообщение в лог сервера и не обращается к платформе
- [x] 2.3 Реализовать серверную валидацию: непустые имя и телефон, корректный формат email при его наличии; проверить `curl` без телефона — ответ с ошибкой валидации и без исходящего запроса к платформе
- [x] 2.4 Реализовать отсев honeypot: непустое поле `max` даёт ответ, идентичный успешному, без вызова платформы; проверить `curl` с `"max":"bot"` — успешный ответ и отсутствие заявки в платформе
- [x] 2.5 Реализовать вызов `POST {LEADS_API_BASE_URL}/api/v1/leads` с заголовками `X-Api-Key` и `Content-Type: application/json`, телом `{email, phone, subject, message, source, payload}` и таймаутом 10 с через `AbortSignal.timeout`; проверить `curl` с валидными данными — заявка появляется в платформе
- [x] 2.6 Реализовать разбор конвертов ответа: успех — `{ ok: true, id }` из `data.id`, ошибка — `{ ok: false, message }` из `error.message`, при этом `error.details` и `error.trace_id` пишутся только в лог сервера; проверить, что тело ответа роута не содержит `trace_id`
- [x] 2.7 Обработать сетевую ошибку и таймаут платформы — ответ `{ ok: false, message }` с текстом о неудачной отправке; проверить, подставив недостижимый `LEADS_API_BASE_URL`, что роут отвечает за разумное время без необработанного исключения

## 3. Клиентский хук

- [x] 3.1 Переписать `src/hooks/useContactForm.ts`: убрать `DEFAULT_ENDPOINT`/`DEFAULT_PROJECT` и опции `endpoint`/`project`, добавить обязательную опцию `source`, отправлять запрос на `import.meta.env.PUBLIC_LEADS_ENDPOINT` со значением по умолчанию `/api/lead`; проверить, что упоминаний `n8n.w1do.ru` в `src/` не осталось (`grep -rn 'n8n.w1do.ru' src` пуст)
- [x] 3.2 Реализовать сбор `payload`: UTM-метки `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` из `location.search` — только присутствующие, плюс `page` из `location.pathname` и `referrer` при непустом `document.referrer`; проверить в браузере на адресе с `?utm_source=ya&utm_campaign=brand`, что в теле запроса есть обе метки и `page`, а отсутствующие метки не переданы
- [x] 3.3 Реализовать отображение полей на контракт платформы: `subject` = `Заявка с сайта: <Имя Фамилия>`, `message` = текст сообщения либо `Имя: <Имя Фамилия>`, ключ `email` опускается при пустом значении; проверить в браузере тело запроса при пустом email — ключа `email` в нём нет
- [x] 3.4 Сохранить клиентскую валидацию имени и телефона с сообщением «Укажите имя и телефон.», добавить проверку формата email и предварительную проверку honeypot; проверить, что при незаполненном телефоне сетевой запрос не уходит
- [x] 3.5 Реализовать разбор ответа роута: `ok: true` → успех и `formEl.reset()`, `ok: false` → показ `message`, сетевая ошибка → текст о неудачной отправке с предложением написать в Telegram; проверить все три ветки в браузере

## 4. Формы

- [x] 4.1 Добавить honeypot-поле в `src/components/contact/ContactForm.tsx` и `src/components/cta/CtaForm.tsx`: `<input type="text" name="max" tabIndex={-1} autoComplete="off" aria-hidden="true">` в контейнере с inline-стилем `position: absolute; left: -9999px`; проверить в браузере, что поле не видно, не получает фокус по Tab и помечено `aria-hidden`
- [x] 4.2 Удалить пропсы `endpoint` и `project` из `ContactForm.tsx` и `CtaForm.tsx`, передать в хук `source`: `contact-page` и `cta-block` соответственно; проверить, что `npx astro check` (или `npx tsc --noEmit`) не сообщает об ошибках типов
- [x] 4.3 Убрать проп `project` из `src/components/Cta.astro` и его передачу в `CtaForm`; проверить `grep -rn 'project=' src/components src/pages` — передач `project` в формы не осталось
- [x] 4.4 Проверить, что кнопка отправки блокируется на время запроса и многократные нажатия подряд создают ровно одну заявку в платформе

## 5. Проверка и выкладка

- [x] 5.1 Выполнить `npm run build` и убедиться, что сборка проходит, а `dist/server/entry.mjs` и роут `/api/lead` присутствуют в серверной сборке
- [x] 5.2 Убедиться поиском по клиентской сборке, что значение ключа отсутствует: `grep -rn 'pk_live' dist/client` не даёт совпадений
- [x] 5.3 Провести дымовой прогон на стенде: успешная заявка с обеих форм, ошибка валидации, заполненная ловушка, недоступная платформа; убедиться, что успешные заявки видны в платформе, а отсев ловушки заявку не создаёт
- [x] 5.4 Зафиксировать в `README.md` требование запускать сайт как node-сервер (`node ./dist/server/entry.mjs`) и задавать `LEADS_API_KEY` в окружении рантайма; проверить, что раздел добавлен
- [x] 5.5 После подтверждения приёма заявок платформой сообщить о готовности вывести n8n-сценарий `https://n8n.w1do.ru/webhook/requests` из эксплуатации (отключение выполняется на стороне n8n, вне этого изменения)

## 6. Правки, выявленные при реализации

- [x] 6.1 Перевести чтение `LEADS_API_KEY` и `LEADS_API_BASE_URL` на `astro:env` (`access: 'secret'`), потому что `import.meta.env` впечатывал ключ в `dist/server` и вырезал проверку конфигурации; проверить, что `grep -rn 'pk_live' dist` пуст, строка `LEADS_API_KEY is not set` присутствует в серверной сборке, а запуск `dist/server/entry.mjs` без ключа отвечает 500
- [x] 6.2 Удалить блок «Contact form validation» из `public/js/function.js` и подключение `validator.min.js` из `Layout.astro`: легаси-обработчик перехватывал submit раньше React и слал форму на несуществующий `form-process.php`; проверить в браузере, что ресурсов `form-process`/`validator.min` в `performance.getEntriesByType('resource')` нет
- [x] 6.3 Перевести формы на чистый React: развести идентификаторы (`leadForm`, `ctaLeadForm`), убрать пустые контейнеры `help-block` под валидатор шаблона и дублирующиеся `id="msgSubmit"`, оставить `required` только на имени и телефоне; проверить в браузере отсутствие дублирующихся идентификаторов и успешную отправку с пустым email
