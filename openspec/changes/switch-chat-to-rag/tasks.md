## 1. Конфиг

- [x] 1.1 Добавить `RAG_API_URL`, `RAG_API_KEY`, `RAG_PROJECT_ID` (server, secret, optional) в `env.schema` в `astro.config.mjs`
- [x] 1.2 Передать их в сервис `web` в `docker-compose.yml` (`${RAG_API_URL:-}` и т. д.)
- [x] 1.3 Вернуть `.env.example` к заглушкам без реальных ключей и добавить `RAG_API_URL=https://rag.w1do.ru/api/v1`, `RAG_API_KEY=`, `RAG_PROJECT_ID=`
- [x] 1.4 Добавить `RAG_PROJECT_ID` в `.env` (значение даёт пользователь, не коммитить)

## 2. Клиент RAG

- [x] 2.1 Создать `src/lib/server/rag/context.ts`: `fetchRagContext(query)` → `{ ok: true, context, sources } | { ok: false, reason }`, таймаут 10 с, `X-Api-Key`, логи без ключа и URL
- [x] 2.2 Вынести чистую функцию `buildRagQuery(history)` (решение 3) в отдельный модуль без `astro:env`

## 3. Промпт и роут

- [x] 3.1 Переписать `RULES` в `system-prompt.ts`: дружелюбный тон, ответы только по разделу «Найденные сведения», запрет выдумывать, ссылки только из фрагментов; правило 4 (заявка) и правила 6–7 сохранить
- [x] 3.2 Заменить `buildKnowledge(getServices())` на раздел из `context` или пометку о недоступности RAG; удалить неиспользуемый код
- [x] 3.3 В `src/pages/api/chat.ts` вызывать `fetchRagContext(buildRagQuery(history))` перед `buildSystemPrompt`

## 4. Плавающее окно

- [x] 4.1 Добавить `chat-popup` в `ChatSource` (`src/lib/chat.ts`) и в `chat-request.ts`
- [x] 4.2 Добавить вариант `popup` и приветствие в `AiChat.tsx`
- [x] 4.3 Создать `src/components/chat/ChatPopup.tsx`: кнопка, панель, автооткрытие раз за сессию (`sessionStorage`), `Esc`, ARIA
- [x] 4.4 Стили кнопки и панели в `src/styles/ai-chat.css`, адаптив ≤ 576px
- [x] 4.5 Подключить `ChatPopup` в `src/layouts/Layout.astro` (`client:idle`), кроме `/chat`

## 5. Тесты и проверка

- [x] 5.1 `tests/rag-context.test.ts`: успешный ответ, `403`, таймаут, нет конфига (fetch замокан), `buildRagQuery`
- [x] 5.2 Тест промпта: нет каталога, есть правило «только по найденным сведениям», пометка при недоступности RAG
- [x] 5.3 `node --experimental-strip-types --test tests/*.test.ts` — зелёные
- [x] 5.4 `npm run build` — успешно; в `dist/client` нет `RAG_API_KEY`/`RAG_PROJECT_ID`
- [x] 5.5 Ручная проверка: вопрос из RAG, вопрос вне RAG, автооткрытие и закрытие, заявка из окна

## 6. Документация

- [ ] 6.1 Обновить `README.md` (переменные RAG), `SUMMARY.md`, `docs/*.md` после Reviewer PASS
