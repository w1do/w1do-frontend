# Пример 05 — Роутинг spokes и одиночных услуг

Два общих роутовых файла в `src/pages/services/`. Их **не нужно** трогать при
добавлении контента — они уже работают на все услуги сразу. Здесь они разобраны,
чтобы понимать механику.

## 5.1. Динамический роут ВСЕХ spokes — `[cluster]/[post].astro`

Реальный файл: `src/pages/services/[cluster]/[post].astro`.
Генерирует по одной странице на каждую запись коллекции `serviceLanding`.

```astro
---
import { getCollection, render } from 'astro:content';
import Layout from "../../../layouts/ServiceLandingLayout.astro";

export async function getStaticPaths() {
  const entries = await getCollection('serviceLanding');
  return entries.map(entry => ({
    params: { cluster: entry.data.cluster, post: entry.id.split('/').pop() },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<Layout frontmatter={entry.data}>
  <Content />
</Layout>
```

Разбор:
- `getCollection('serviceLanding')` — все spokes всех услуг.
- `params.cluster` = frontmatter-поле `cluster` (первый сегмент URL).
- `params.post` = `entry.id.split('/').pop()` = имя `.md`-файла (второй сегмент URL).
- Итоговый URL: `/services/<cluster>/<post>`.
- **Вывод:** добавил новый `.md`-spoke с корректным `cluster` — новая страница
  появилась сама, никаких правок роутов.

## 5.2. Роут одиночных (не-hub) услуг — `[...slug].astro`

Реальный файл: `src/pages/services/[...slug].astro`.
Рендерит услуги коллекции `services`, **у которых нет `hub: true`**.

```astro
---
import { getCollection, render } from 'astro:content';
import Layout from "../../layouts/ServiceLayout.astro";

export async function getStaticPaths() {
  const entries = await getCollection('services', ({ data }) => data.hub !== true);
  return entries.map(entry => ({
    params: { slug: entry.id }, props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<Layout frontmatter={entry.data}>
  <Content />
</Layout>
```

Разбор:
- Фильтр `data.hub !== true` **исключает хабы**. Иначе на URL `/services/<slug>`
  претендовали бы сразу два роута — этот и хаб-роут `<slug>/index.astro`.
- `params: { slug: entry.id }` — здесь `entry.id` = `<slug>` (спасибо `generateId`).

## Как уживаются три роута на `/services/<slug>`

```
Услуга с hub: true          →  src/pages/services/<slug>/index.astro   (хаб-роут)
Услуга без hub              →  src/pages/services/[...slug].astro       (одиночная)
Любая посадочная под-страница →  src/pages/services/[cluster]/[post].astro
```

Ключ к отсутствию конфликтов — флаг `hub: true` в pillar: он «переключает»
услугу с одиночного роута на кластерный хаб.
