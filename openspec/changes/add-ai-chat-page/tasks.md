Статус на 2026-10-14 после первого прогона Implementer и последующей проверки T1 и T9 с настоящим ключом. Отметки поставлены по отчёту orchestrator, переданному при эскалации.

## 1. Конфигурация и SEO

- [x] 1.1 Добавить в `env.schema` в `astro.config.mjs` `POLZA_AI_API_KEY` (secret, optional) и `POLZA_AI_MODEL` (secret, `default: 'openai/gpt-4o-mini'`)
- [x] 1.2 Добавить запись `"/chat"` в `pageSeo` в `src/lib/seo.ts`
- [x] 1.3 Добавить `"/chat"` в массив `paths` в `src/pages/sitemap-0.xml.ts`
- [ ] 1.4 (человек) Добавить `POLZA_AI_API_KEY` в `.env`, плейсхолдер в `.env.example` и в окружение продакшена. Агентам запрещено трогать `.env*`

## 2. Серверный слой

- [x] 2.1 Создать `src/lib/chat.ts`: типы `ChatMessage` и `ChatResponse`, константы лимитов
- [x] 2.2 Создать `src/lib/server/polza/chat.ts`: `createPolzaCompletion`, ошибка конфигурации при отсутствии ключа
- [x] 2.3 Создать `src/lib/server/chat/rate-limit.ts`: `clientKeyFrom`, `checkRateLimit`
- [x] 2.4 Создать `src/lib/server/chat/system-prompt.ts`: `toPlainText`, `buildKnowledge`, `buildSystemPrompt`
- [x] 2.5 Создать `src/pages/api/chat.ts`: `POST`, `prerender = false`

## 3. Клиент и страница

- [x] 3.1 Создать `src/hooks/useAiChat.ts`
- [x] 3.2 Создать `src/components/chat/AiChat.tsx`
- [x] 3.3 Создать `src/pages/chat.astro` с `robots="index, follow"` и стилями `ai-chat`

## 4. Проверка

- [x] 4.1 `npm run build` без ошибок
- [x] 4.2 `grep -rl "polza.ai" dist/client` и `grep -rl "POLZA_AI_API_KEY" dist/client` возвращают пусто
- [x] 4.3 Smoke-тесты из `proposal.md`, по частям:
  - [x] T2–T8, T10
  - [x] T8b: в первой редакции не прошёл, потому что Astro заменяет пустой `POLZA_AI_MODEL` на default. Сценарий переписан при эскалации и прогнан повторно после пункта 7.1 (dev-сервер)
  - [x] T1: пройден с настоящим ключом, `/api/chat` вернул ответ со ссылкой на w1do.ru/contact
  - [x] T9 (prompt injection): пройден, отказ на запрос раскрыть промпт
- [ ] 4.4 Браузерная проверка `/chat` на 1440 и 375 px не запускалась. Нужен dev-сервер с настоящим ключом, чтобы увидеть ответы и ссылки, и браузер, которого у Implementer нет. Выполнить человеку или агенту с браузером

## 5. Память проекта

- [x] 5.1 `memory_update` по всем новым и изменённым файлам, `memory_annotate` для новых
- [x] 5.2 `memory_status`: 0 stale, 0 unindexed, 0 errors

## 6. Чек-лист выкладки (человек)

- [ ] 6.1 `POLZA_AI_API_KEY` задан в окружении продакшена; `POLZA_AI_MODEL` задаётся только если нужна модель, отличная от `openai/gpt-4o-mini` (пустое значение равно default)
- [ ] 6.2 Перед контейнером стоит ровно один обратный прокси, который дописывает `X-Forwarded-For`. Если прокси нет или их больше одного, лимит по клиенту работает неверно, и выбор ключа клиента нужно пересмотреть до выкладки
- [ ] 6.3 После выкладки `/chat` есть в `https://w1do.ru/sitemap-0.xml`, и на вопрос о заказе приходит ответ со ссылкой на `/contact`

## 7. Исправление после эскалации

- [x] 7.1 Удалить недостижимую проверку пустой модели в `src/lib/server/polza/chat.ts`, строки 30–34 (см. раздел «Исправление после эскалации» в `proposal.md`). Проверено: в `createPolzaCompletion` до `fetch` такой проверки нет, `model` передаётся как `POLZA_AI_MODEL.trim()`
- [x] 7.2 `npm run build`, повторить T8 и T8b в новой редакции (build exit 0, T8 и T8b пройдены на dev-сервере)
- [ ] 7.3 `memory_update` и `memory_annotate` для `src/lib/server/polza/chat.ts`, `memory_status` 0/0/0
