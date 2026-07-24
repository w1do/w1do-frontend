# Пример 04 — Единый хаб-роут `[cluster]/index.astro`

Реальный файл: `src/pages/services/[cluster]/index.astro`.
URL всех хабов: `/services/<slug>` (напр. `/services/ai-assistants-chatbots`).

Это **ОДИН общий динамический маршрут, который генерирует страницы ВСЕХ услуг-хабов**.
Отдельного `.astro`-файла под каждую услугу больше нет — раньше их было 22 почти
одинаковых (различались строкой `const cluster`), теперь всё делает `getStaticPaths`.
Чтобы добавить новую услугу-хаб, `.astro`-файлы создавать НЕ нужно — достаточно
pillar `index.md` с `hub: true`.

## Полный файл (as-is)

```astro
---
import { getCollection, render } from 'astro:content';
import ServiceLayout from '../../../layouts/ServiceLayout.astro';

export async function getStaticPaths() {
  const hubs = await getCollection('services', ({ data }) => data.hub === true);
  const spokes = await getCollection('serviceLanding');
  return hubs.map((pillar) => ({
    params: { cluster: pillar.id },
    props: {
      pillar,
      spokes: spokes
        .filter(({ data }) => data.cluster === pillar.id)
        .sort((a, b) => a.data.order - b.data.order)
        .map((entry) => ({
          title: entry.data.title,
          description: entry.data.description,
          excerpt: entry.data.excerpt,
          icon: entry.data.icon,
          tags: entry.data.tags,
          url: `/services/${pillar.id}/${entry.id.split('/').pop()}`,
        })),
    },
  }));
}

const { pillar, spokes } = Astro.props;
const { Content } = await render(pillar);
---

<ServiceLayout frontmatter={pillar.data} spokes={spokes}>
  <Content />
</ServiceLayout>
```

## Разбор

- **`import ServiceLayout from '../../../layouts/…'`** — три `../`: файл лежит в
  `src/pages/services/[cluster]/`, а макеты — в `src/layouts/`.
- **`getStaticPaths()`** — на этапе сборки порождает по одной странице на каждый
  pillar c `hub: true`. `params.cluster = pillar.id` (= `<slug>` благодаря
  `generateId`, см. `01-content.config.ts.md`) → URL `/services/<slug>`.
- **`getCollection('services', ({ data }) => data.hub === true)`** — берём только
  хабы. Фильтр важен: он разводит этот маршрут с `[...slug].astro`, который
  берёт `data.hub !== true`. Их наборы путей не пересекаются, конфликта нет.
- **`spokes.filter(... data.cluster === pillar.id)`** — для каждого хаба берём
  только его spokes, сортируем по `order`, маппим в объекты карточек. `url`
  собирается как `/services/<slug>/<имя файла>` (`entry.id.split('/').pop()` =
  последний сегмент id, т.е. имя `.md`).
- **`Astro.props`** — `pillar` и `spokes` приходят из `props` конкретного пути,
  а не из модульного скоупа. `render(pillar)` → `Content` кладётся в `<slot/>`.
- **`<ServiceLayout frontmatter={pillar.data} spokes={spokes}>`** — `frontmatter`
  рисует шапку/offers/features/process/pricing/faqs, а `spokes` — блок карточек
  «Направления услуги» (компонент `ClusterSpokes`, см. `06-cluster-components.md`).

## Как добавить хаб для НОВОЙ услуги

В роутинге создавать НИЧЕГО не нужно. Достаточно контента:

```bash
# 1) папка услуги + pillar с hub: true
mkdir -p src/content/services/<новый-slug>
#    создать src/content/services/<новый-slug>/index.md  (frontmatter c hub: true)
# 2) 2–3 spoke-файла рядом:  src/content/services/<новый-slug>/<spoke>.md
```

> Хаб `/services/<новый-slug>` появится автоматически из общего
> `[cluster]/index.astro`, а spokes — из общего `[cluster]/[post].astro`
> (см. `05-routing.md`).
