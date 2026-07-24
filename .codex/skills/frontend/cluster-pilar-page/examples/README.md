# Примеры кластерной страницы услуги (эталон `ai-assistants-chatbots`)

Здесь собраны **реальные файлы** из проекта, разобранные построчно. Это не
абстрактные шаблоны, а точная копия того, как реализован эталонный кластер
`ai-assistants-chatbots`. Копируй эти файлы под новую услугу, меняя только
тексты и `slug`.

| Файл-пример | Что показывает | Реальный файл в проекте |
|-------------|----------------|--------------------------|
| [`01-content.config.ts.md`](./01-content.config.ts.md) | Обе коллекции: `services` (pillar) и `serviceLanding` (spokes), glob + `generateId` | `src/content.config.ts` |
| [`02-pillar-index.md.md`](./02-pillar-index.md.md) | Полный pillar (`index.md`) со всеми полями frontmatter | `src/content/services/ai-assistants-chatbots/index.md` |
| [`03-spoke.md.md`](./03-spoke.md.md) | Полный spoke с обязательной перелинковкой в конце | `src/content/services/ai-assistants-chatbots/telegram-chatbot.md` |
| [`04-hub-index.astro.md`](./04-hub-index.astro.md) | Единый хаб-роут ВСЕХ услуг (динамический, через `getStaticPaths`) | `src/pages/services/[cluster]/index.astro` |
| [`05-routing.md`](./05-routing.md) | Динамический роут spokes и роут одиночных услуг | `src/pages/services/[cluster]/[post].astro`, `[...slug].astro` |
| [`06-cluster-components.md`](./06-cluster-components.md) | Компоненты списка spokes на хабе | `src/components/services/cluster/*.astro` |

## Как этим пользоваться

**Добавить spoke в существующую услугу:** нужен только файл вида `03-spoke.md.md`
— создай `.md` в папке услуги, роут появится сам.

**Создать новую услугу-кластер:** нужен только `02` (pillar `index.md` с
`hub: true`) + 2–3 файла `03` (spokes). Хаб-роут (`04`) создавать НЕ нужно —
единый `[cluster]/index.astro` подхватит услугу автоматически. Файлы `01`, `04`,
`05`, `06` — уже готовы в проекте и обычно не трогаются; они здесь для понимания
механики.

Порядок и подробные объяснения — в `../SKILL.md`.
