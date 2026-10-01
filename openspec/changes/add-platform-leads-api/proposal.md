## Why

Заявки с сайта сейчас уходят на сторонний n8n-вебхук (`https://n8n.w1do.ru/webhook/requests`), захардкоженный в `src/hooks/useContactForm.ts` и продублированный дефолтными пропсами в `ContactForm.tsx` и `CtaForm.tsx`. Заявки не попадают в платформу `backend.w1do.ru`, где ведётся учёт лидов проекта, нет защиты от ботов и нет атрибуции источника. Платформа предоставляет `POST /api/v1/leads` (см. `LLM.txt`) — переводим приём заявок на неё как на единственный канал.

## What Changes

- Добавляется серверный прокси-роут Astro `POST /api/lead` (`prerender = false`), который принимает заявку с фронтенда, валидирует её и пересылает в `POST {LEADS_API_BASE_URL}/api/v1/leads` с заголовком `X-Api-Key`. Ключ читается из приватной серверной переменной окружения и никогда не попадает в клиентский бандл.
- `src/hooks/useContactForm.ts` перестаёт формировать полезную нагрузку n8n (`{email, subject, phone, message, project}`) и переходит на контракт платформы: `email`, `phone`, `subject`, `message`, `source`, `payload` (UTM-метки и страница обращения) и honeypot-поле `max`.
- В формы добавляется скрытое honeypot-поле `max`; заполненная ловушка приводит к «тихому успеху» без обращения к платформе.
- Хук распаковывает конверты платформы: успех — `{"data": {"id", "status"}}`, ошибка — `{"error": {"code", "message", "details", "trace_id"}}`; текст ошибки показывается пользователю.
- **BREAKING**: пропсы `endpoint` и `project` удаляются из `useContactForm`, `ContactForm` и `CtaForm`; `Cta.astro` больше не пробрасывает `project`. Отправка в n8n-вебхук прекращается полностью.
- В `.env.example` добавляются ключи интеграции: `LEADS_API_BASE_URL`, `LEADS_API_KEY`, `PUBLIC_LEADS_ENDPOINT`; в `.env` — реальные значения из `LLM.txt`.
- Из состава этого изменения исключены остальные разделы `LLM.txt` (контент, аналитика, оплаты, пользователи сайта) — только заявки.

## Capabilities

### New Capabilities
- `lead-submission`: приём заявки с форм сайта, её валидация, защита от ботов, атрибуция источника и доставка в платформу через серверный прокси с сокрытием ключа API.

### Modified Capabilities

_Нет: `openspec/specs/` пуст, существующих спецификаций для изменения нет._

## Impact

- **Код**: новый `src/pages/api/lead.ts`; правки в `src/hooks/useContactForm.ts`, `src/components/contact/ContactForm.tsx`, `src/components/cta/CtaForm.tsx`, `src/components/Cta.astro`.
- **Конфигурация**: `.env.example`, `.env`; при `output: 'static'` роут `/api/lead` должен явно объявить `prerender = false`, иначе он не окажется в сборке.
- **Развёртывание**: сайт обязан выполняться как node-сервер (`dist/server/entry.mjs`, что уже делает `Dockerfile`); при выкладке чистой статики роут работать не будет. `LEADS_API_KEY` должен быть задан в окружении рантайма.
- **Внешние системы**: платформа `backend.w1do.ru` становится приёмником заявок; n8n-вебхук отключается — его нужно вывести из эксплуатации отдельно.
- **Безопасность**: ключ `pk_live_…` из `LLM.txt` остаётся серверным; `.env` уже в `.gitignore`, `.env.example` содержит только плейсхолдеры.
