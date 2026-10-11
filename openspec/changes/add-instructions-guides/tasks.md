## 1. CMS: коллекция `guides`

- [ ] 1.1 Создать коллекцию `guides` (slug `guides`, `url_segment: instructions`) через MCP W1DO после «да» пользователя и проверить её появление в `collections_list`
- [ ] 1.2 Добавить поля по образцу `cases`: `description` (textarea), `rubric` (select, is_filterable), `rubric_slug` (text, is_filterable), `cover` (image), `body` (rich_text) и сверить состав в `collections_show`
- [ ] 1.3 Создать 2–3 записи-гайда (рубрики `claude-code`, `tunneling`), опубликовать и убедиться через `entries_list`, что статус `published`

## 2. Адаптер и данные

- [ ] 2.1 Реализовать/сверить `src/lib/server/w1do/guides.ts` (`getGuides`, `getGuideRubrics`, `getGuideBySlug`, кэш ~60 с, только `published`, пустой массив при 404/нет `data`) и проверить выгрузку коллекции на dev-сервере
- [ ] 2.2 Проверить, что записи без `rubric_slug` отбрасываются и не ломают маршруты

## 3. Компоненты

- [ ] 3.1 Создать `src/components/instructions/InstructionsSidebar.astro` (активная рубрика через `aria-current`) и проверить рендер активной/неактивной рубрики
- [ ] 3.2 Создать `GuideCard.astro` по мотивам `post-item` из `BlogList.astro` и сверить стиль с карточками блога
- [ ] 3.3 Создать `GuidesGrid.astro` (сетка `col-xl-4 col-md-6` + пустое состояние) и проверить оба состояния
- [ ] 3.4 Убедиться, что все файлы раздела ≤150 строк

## 4. Страницы

- [ ] 4.1 Создать `src/pages/instructions/index.astro` (все гайды + сайдбар, title/description) и проверить 200, карточки и пустое состояние
- [ ] 4.2 Создать `[rubric]/index.astro` (фильтр; неизвестный slug → `Astro.rewrite("/404")`) и проверить фильтрацию, 404 и заголовок-рубрику
- [ ] 4.3 Создать `[rubric]/[slug].astro` (полный гайд, крошки, SEO-мета, canonical; неизвестный slug → 404; чужая рубрика → 301) и проверить все три кейса
- [ ] 4.4 Проверить, что черновики не видны ни на одной из трёх страниц

## 5. Шапка и sitemap

- [ ] 5.1 Добавить пункт «Инструкции» → `/instructions` в `Header.astro` перед «Блог» и проверить его на разных страницах
- [ ] 5.2 Добавить `/instructions`, адреса рубрик и гайдов в `src/lib/server/full-sitemap.ts` и проверить их в sitemap.xml

## 6. Приёмка

- [ ] 6.1 `npm run build` завершается без ошибок
- [ ] 6.2 Обход в dev: `/instructions`, страница рубрики, гайд, 404, 301, шапка
- [ ] 6.3 Сверить покрытие всех требований `specs/instructions/spec.md`
