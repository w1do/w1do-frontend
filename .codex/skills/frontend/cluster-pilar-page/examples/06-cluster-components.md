# Пример 06 — Компоненты списка spokes на хабе

Папка: `src/components/services/cluster/`. Два маленьких компонента рисуют блок
«Направления услуги» на хабе. Уже готовы в проекте — обычно не трогаются. Важно:
**они переиспользуют существующий стиль вёрстки** `service-offer-item` (тот же
вид, что блок «Что я предлагаю»), новых глобальных CSS-классов не добавляем.

## 6.1. `ClusterSpokes.astro` — секция-обёртка

```astro
---
import SpokeCard from "./SpokeCard.astro";

interface Spoke {
    title: string;
    description: string;
    excerpt?: string;
    icon?: string;
    tags?: string[];
    url: string;
}

interface Props {
    spokes: Spoke[];
    title?: string;
    description?: string;
}

const { spokes, title = "Другие услуги", description } = Astro.props;
---

{spokes.length > 0 && (
    <div class="service-offer-box">
        <div class="section-title">
            <span class="section-sub-title wow fadeInUp">Направления услуги</span>
            <h2 class="text-anime-style-3" data-cursor="-opaque">{title}</h2>
            {description && <p class="wow fadeInUp" data-wow-delay="0.2s">{description}</p>}
        </div>

        <div class="service-offer-item-list">
            {spokes.map((spoke, index) => (
                <SpokeCard
                    title={spoke.title}
                    description={spoke.excerpt || spoke.description}
                    icon={spoke.icon || "/images/icon-service-offer-list-1.svg"}
                    link={spoke.url}
                    delay={`${0.4 + index * 0.2}s`}
                />
            ))}
        </div>
    </div>
)}
```

Разбор:
- Рендерится только если есть spokes (`spokes.length > 0`).
- Подзаголовок жёстко «Направления услуги», заголовок — проп `title` (дефолт
  «Другие услуги»). Раньше были «Посадочные страницы» / «Решения кластера» —
  заменены на тематические.
- Обёртка списка — штатный класс `service-offer-item-list` (flex-раскладка и
  отступы уже описаны в `custom.css`), поэтому кастомные стили не нужны.
- В карточку идёт `excerpt` (или `description` как fallback).

## 6.2. `SpokeCard.astro` — одна карточка (ссылка)

```astro
---
interface Props {
    title: string;
    description: string;
    icon: string;
    link: string;
    delay?: string;
}

const { title, description, icon, link, delay = "0.4s" } = Astro.props;
---

<a href={link} class="service-offer-item box-border-gradiant wow fadeInUp" data-wow-delay={delay}>
    <div class="icon-box">
        <img src={icon} alt={title} style="filter: brightness(0) invert(1);">
    </div>
    <div class="service-offer-item-content">
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
</a>

<style>
    .service-offer-item {
        text-decoration: none;
        color: inherit;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .service-offer-item:hover {
        transform: translateY(-5px);
    }
</style>
```

Разбор:
- **Вся карточка — `<a href={link}>`**: кликается целиком, ведёт на страницу spoke.
- Классы `service-offer-item box-border-gradiant` — из исходного шаблона, дают
  тот же вид, что карточки «Что я предлагаю».
- `filter: brightness(0) invert(1)` делает иконку белой (как в оригинале).
- Единственный scoped-стиль — сброс подчёркивания/цвета ссылки и лёгкий hover;
  ничего глобального не переопределяем.

## История изменений (чтобы не откатить)

Изначально карточки spoke рисовались классом `service-item` с номером `[ NN ]` и
тегами и лежали в `row`/`col-md-6`. По просьбе заказчика их переделали под стиль
`service-offer-item-list` / `service-offer-item` (как блок «Что я предлагаю»):
убрали номер и теги, сделали всю карточку кликабельной ссылкой. Не возвращай
старый вид.
