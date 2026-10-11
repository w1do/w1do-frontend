# add-home-media-resources: блок «Медиа и сообщество» на главной

## Open questions

Вопросов, требующих решения человека, нет. Все проектные решения зафиксированы ниже.
Два решения приняты архитектором по умолчанию и отмечены в разделе «Rollback / Uncertainty»
(иллюстрации и формулировки о содержании каналов) — владелец может поправить их после
визуальной проверки без изменения архитектуры.

---

## 1. Problem statement

На главной (`src/pages/index.astro`) нет блока, который ведёт посетителя в медиа-ресурсы
компании: YouTube-канал, Telegram-канал и Telegram-чат «IT-ИИшница в Telegram». Ссылки
есть только в футере (чат) и на странице `/about` (кнопки YouTube и Telegram внутри
`Awards` с `showSocialLinks`). Нужен отдельный блок сразу после «О разработчике»
(`<About …>`), визуально повторяющий блок «Экспертиза и практика» (`src/components/Awards.astro`).

## 2. Goals / Non-goals

Goals
- Новый Astro-компонент `MediaResources`, разметка и классы 1:1 как у `Awards.astro`
  (левая колонка: подзаголовок, H2, абзац, счётчик; правая колонка: список из 3 карточек
  в рамке `box-border-gradiant`), но каждая карточка — ссылка на ресурс.
- Вставка в `index.astro` строго между `<About … />` и `<Services … />`.
- Три иконки одного набора (Universal Line из MCP `assets`), сохранённые локально в
  `public/images/media/`.
- Вертикальный ритм как у соседних секций.

Non-goals
- Не трогаем `Awards.astro`, `Footer.astro`, `about.astro`, `custom.css`, другие страницы.
- Не выносим существующие ссылки Footer/Awards в общий конфиг (это отдельный рефакторинг).
- Не добавляем слайдер логотипов (`company-supports-slider-box-prime`) из Awards — для
  медиа-блока он не несёт смысла, а второй экземпляр `.company-supports-slider-prime`
  на странице инициализировался бы тем же Swiper-селектором в `public/js/function.js`.
- Никаких запросов к платформе/CMS, никаких UI-китов, никакого клиентского JS.

## 3. Current architecture analysis

- Astro 6, SSR через `@astrojs/node`; страница `src/pages/index.astro` собирает секции из
  `src/components/*.astro`, тексты передаются пропсами.
- Стили — глобальный `src/styles/custom.css` (шаблон темы) + небольшие scoped `<style>` в
  компонентах. Токены: `--text-color #D0D0D0`, `--primary-color #FFF`, `--accent-color #CFF85E`,
  `--divider-color`, `--dark-divider-color`, `--secondary-color`, `--accent-secondary-color`.
- Анимации: классы `wow fadeInUp`, `text-anime-style-3`, счётчик `.counter`
  (jQuery counterUp, `public/js/function.js:230`, применяется ко всем `.counter`).
- `Awards.astro`: корень `<div class='our-awards-prime bg-section'>`.
  `.our-awards-prime{padding:120px 0}` (60px на ≤991px), `.bg-section` — скруглённая
  подложка `#1B1B1B`, max-width 1820px. Иконки рендерятся `<img>` 80×80 с
  `filter: brightness(0) invert(1)` (чёрный SVG → белый). Правая колонка карточки
  (`awards-item-year-prime h3`) — scoped `font-size: 32px !important`.
- Отступы соседей: `.about-us{padding:120px 0}`, `.our-services{padding:120px 0}`,
  оба 60px на мобильных. Текущий ритм `Pricing (120) → Awards bg-section (120 внутри) →
  Choose (120)` — тот же, что получится `About (120) → Media bg-section → Services (120)`.
  Компонент `src/components/shared/Spacer.astro` на главной не используется и **не нужен**.
- Константы-данные живут в `src/lib/*.ts` (`contact-emails.ts`, `legal.ts`) как
  `export const X = [...] as const;`. Подпапки компонентов по фичам: `blog/`, `projects/`,
  `services/`, `shared/`.
- Глобальное `a{text-decoration:none}`; цвет ссылки задаёт bootstrap (синий), поэтому
  карточке-ссылке нужен явный `color`.
- Нет скриптов lint/test/typecheck в `package.json`; проверка — `npm run build`.

## 4. Relevant files and symbols

| Файл | Роль |
|---|---|
| `src/pages/index.astro` | Импорты секций; `<About …/>` (стр. ~34–40), `<Services …/>` (стр. ~41–44) |
| `src/components/Awards.astro` | Эталон разметки (только чтение) |
| `src/components/About.astro` | Сосед сверху (только чтение) |
| `src/styles/custom.css` | `.our-awards-prime`, `.awards-*-prime`, `.bg-section`, `.box-border-gradiant` (только чтение) |
| `src/lib/contact-emails.ts` | Образец модуля-константы |
| `src/components/shared/Footer.astro:79-82` | Источник названия и ссылки чата (только чтение) |

## 5. Proposed architecture

```
src/lib/media-resources.ts          — данные: тексты секции + 3 ресурса (typed, as const)
src/components/media/MediaResources.astro — разметка (копия структуры Awards без слайдера)
public/images/media/*.svg           — 3 локальные иконки
src/pages/index.astro               — import + <MediaResources /> после <About/>
```

Компонент статический (без `client:*`), данные — локальные константы, без fetch.

## 6. Detailed implementation plan

### 6.1 Ассеты (MCP `assets`, набор `universal-line`, стиль line-black, fill="black", 24×24)

| Локальный файл | object_key | URL |
|---|---|---|
| `public/images/media/icon-youtube.svg` | `assets/icons/universal/SVG/Line/Social Media and Brands/YouTube.svg` | https://n8n.w1do.ru/webhook/assets-file?object_key=assets%2Ficons%2Funiversal%2FSVG%2FLine%2FSocial%20Media%20and%20Brands%2FYouTube.svg |
| `public/images/media/icon-telegram-channel.svg` | `assets/icons/universal/SVG/Line/Shopping and Ecommerce/Megaphone.svg` | https://n8n.w1do.ru/webhook/assets-file?object_key=assets%2Ficons%2Funiversal%2FSVG%2FLine%2FShopping%20and%20Ecommerce%2FMegaphone.svg |
| `public/images/media/icon-telegram-chat.svg` | `assets/icons/universal/SVG/Line/Communication/Chat Text.svg` | https://n8n.w1do.ru/webhook/assets-file?object_key=assets%2Ficons%2Funiversal%2FSVG%2FLine%2FCommunication%2FChat%20Text.svg |

Почему этот набор: в складе нет иконки Telegram в линейном стиле; смешивать наборы
запрещено (один визуальный стиль). Universal Line содержит YouTube, рупор (канал =
вещание) и облако чата — все одинаковой толщины, чёрная заливка, корректно
перекрашиваются в белый тем же `filter`, что и в Awards. Принадлежность к Telegram
передаётся текстом заголовка карточки.

Получение: `mcp__assets__assets_download` с точным `object_key` и запись поля `content`
в файл без изменений. Если MCP недоступен —
`curl -fsSL "<URL>" -o public/images/media/<file>`.
Проверка каждого файла: начинается с `<svg`, не содержит `<script` и атрибутов `on*=`
(`grep -LE '<script|\son[a-z]+=' public/images/media/*.svg` должен вывести все 3 файла).

### 6.2 `src/lib/media-resources.ts` (новый файл, точное содержимое)

```ts
export interface MediaResource {
    icon: string;
    title: string;
    description: string;
    label: string;
    href: string;
}

export const MEDIA_SECTION = {
    subTitle: "Медиа и сообщество",
    title: "Где я показываю разработку ИИ изнутри",
    description:
        "В коммерческих проектах заказчик видит готовый результат. Здесь я выкладываю то, что обычно остаётся за кадром: как собираю агентов, где они ломаются и какие инструменты в итоге оставляю в работе.",
    counterValue: "3",
    counterDesc: "площадки: видео, короткие заметки и чат, где можно задать вопрос.",
} as const;

export const MEDIA_RESOURCES: readonly MediaResource[] = [
    {
        icon: "/images/media/icon-youtube.svg",
        title: "YouTube @w1do_digital",
        description:
            "Записи экрана без монтажных чудес: подключаю LLM к живым сервисам, собираю агентов в Cursor и Claude Code и показываю, на каком шаге всё пошло не так и как я это починил.",
        label: "Видео",
        href: "https://www.youtube.com/@w1do_digital",
    },
    {
        icon: "/images/media/icon-telegram-channel.svg",
        title: "Telegram @w1do_tech",
        description:
            "Заметки на пару минут чтения: что поменялось в моделях, какой MCP-сервер прижился в моих проектах, какой промпт пришлось переписать после первого же теста.",
        label: "Канал",
        href: "https://t.me/w1do_tech",
    },
    {
        icon: "/images/media/icon-telegram-chat.svg",
        title: "IT-ИИшница в Telegram",
        description:
            "Чат для тех, кто уже внедряет ИИ или только примеряется. Спросите про RAG, выбор модели или стоимость токенов, и ответят люди, которые решали ту же задачу у себя.",
        label: "Чат",
        href: "https://t.me/+sJeHrjLGkbNjN2Yy",
    },
];
```

Тексты прошли `text-human-check` (`scripts/ai_signs.py`): PASS, score 0. Не переписывать.

### 6.3 `src/components/media/MediaResources.astro` (новый файл, точное содержимое)

```astro
---
import { MEDIA_RESOURCES, MEDIA_SECTION, type MediaResource } from "../../lib/media-resources";

interface Props {
    subTitle?: string;
    title?: string;
    description?: string;
    counterValue?: string;
    counterDesc?: string;
    resources?: readonly MediaResource[];
}

const {
    subTitle = MEDIA_SECTION.subTitle,
    title = MEDIA_SECTION.title,
    description = MEDIA_SECTION.description,
    counterValue = MEDIA_SECTION.counterValue,
    counterDesc = MEDIA_SECTION.counterDesc,
    resources = MEDIA_RESOURCES,
} = Astro.props;
---
<!-- Media Resources Section Start -->
<div class='our-awards-prime bg-section'>
    <div class='container'>
        <div class='row'>
            <div class='col-xl-6'>
                <div class='awards-content-prime'>
                    <div class='section-title'>
                        <span class='section-sub-title wow fadeInUp'>{subTitle}</span>
                        <h2 class='text-anime-style-3' data-cursor='-opaque'>{title}</h2>
                        <p class='wow fadeInUp' data-wow-delay='0.2s'>{description}</p>
                    </div>

                    <div class='awards-counter-box-prime wow fadeInUp'>
                        <h2><span class='counter'>{counterValue}</span></h2>
                        <p>{counterDesc}</p>
                    </div>
                </div>
            </div>

            <div class='col-xl-6'>
                <div class='awards-item-list-prime box-border-gradiant'>
                    {resources.map((resource, index) => (
                        <a
                            class='awards-item-prime media-resource-item wow fadeInUp'
                            data-wow-delay={index > 0 ? `${index * 0.2}s` : undefined}
                            href={resource.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            data-cursor='-opaque'
                        >
                            <div class='awards-item-body-prime'>
                                <div class='icon-box'>
                                    <img src={resource.icon} alt='' width='80' height='80' loading='lazy' style='width: 80px; height: 80px; filter: brightness(0) invert(1);'>
                                </div>
                                <div class='awards-item-content-prime'>
                                    <h3>{resource.title}</h3>
                                    <p>{resource.description}</p>
                                </div>
                            </div>
                            <div class='awards-item-year-prime'>
                                <h3>{resource.label}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Media Resources Section End -->

<style>
    .media-resource-item,
    .media-resource-item:hover {
        color: var(--text-color);
    }

    .media-resource-item:focus-visible {
        outline: 2px solid var(--accent-color);
        outline-offset: 8px;
        border-radius: 4px;
    }

    .awards-item-year-prime h3 {
        font-size: 32px !important;
    }
</style>
```

Примечания (не менять):
- Классы `our-awards-prime`, `awards-*-prime`, `bg-section`, `box-border-gradiant` —
  те же, что в Awards: стиль, адаптив и отступы берутся из `custom.css` без правок.
- Счётчик без суффикса `+` (ресурсов ровно 3, «3+» было бы неправдой); поэтому без regex
  из Awards.
- `alt=''` — иконка декоративная, имя ресурса уже в `<h3>` внутри ссылки.
- Scoped `<style>` Astro применяется только к элементам этого компонента; Awards не затронут.

### 6.4 `src/pages/index.astro` (правка)

1. После строки `import About from "../components/About.astro";` добавить строку:
   `import MediaResources from "../components/media/MediaResources.astro";`
2. Между закрывающим `/>` блока `<About … counterTag="Разработанных ИИ-систем" />` и
   строкой `<Services` вставить строку с тем же отступом (один таб):
   `	<MediaResources/>`

Больше ничего в файле не менять.

## 7. Data-flow / control-flow

Build/SSR: `index.astro` → `MediaResources.astro` читает константы из
`src/lib/media-resources.ts` → рендерит статичный HTML. Клиент: существующие глобальные
скрипты (`wow`, SplitText для `text-anime-style-3`, counterUp для `.counter`) сами
подхватывают новые элементы по классам. Новых скриптов, запросов и состояний нет.

## 8. API / DB / UI / domain changes

- API, БД, CMS: нет.
- UI: новая секция на `/` между «О разработчике» и «Услуги разработчика ИИ».
- Внешние ссылки (точно):
  - YouTube: `https://www.youtube.com/@w1do_digital`
  - Telegram-канал: `https://t.me/w1do_tech`
  - Telegram-чат «IT-ИИшница в Telegram»: `https://t.me/+sJeHrjLGkbNjN2Yy`

## 9. Validation and error handling

Данных от пользователя нет. Валидация — типами TS (`MediaResource`). Ошибка отсутствия
файла иконки проявится как битое изображение — проверяется визуально и через
`ls public/images/media`.

## 10. Authorization and security

- Внешние ссылки только с `target='_blank' rel='noopener noreferrer'`.
- SVG из склада проверяются на отсутствие `<script>`/`on*=` (шаг 6.1); подключаются через
  `<img>`, где скрипты в SVG всё равно не исполняются.
- Секретов, ключей, env-переменных не добавляется. Прямых запросов к платформе из UI нет.

## 11. Backward compatibility

Только добавление. Существующие компоненты, стили и маршруты не меняются. Sitemap/SEO не
затрагиваются (H2 внутри страницы, H1 остаётся в Hero).

## 12. Test strategy

В проекте нет unit-тестов, линтера и `astro check` (пакет `@astrojs/check` не установлен) —
это N/A, новые инструменты не добавлять.
1. `npm run build` — должен завершиться с кодом 0.
2. `grep -c "" src/components/media/MediaResources.astro src/lib/media-resources.ts` —
   каждый ≤ 150 строк.
3. Визуальная проверка: `npm run dev`, открыть `http://localhost:4321/`, сделать скриншоты
   на ширине 1440px и 375px: секция идёт сразу после «О разработчике», выглядит как блок
   «Экспертиза и практика» ниже по странице (рамка, шрифты, иконки белые 80px, правая
   подпись 32px, разделители между карточками), отступ сверху/снизу как у Awards.
   Клик по каждой карточке открывает правильный URL в новой вкладке.
4. `git status --short` — изменены/добавлены только файлы из раздела 15.

## 13. Acceptance criteria

1. На `/` порядок секций: Hero → About → **MediaResources** → Services → … → Awards (без изменений).
2. Разметка новой секции использует классы Awards (`our-awards-prime bg-section`,
   `awards-content-prime`, `awards-counter-box-prime`, `awards-item-list-prime box-border-gradiant`,
   `awards-item-prime`, `awards-item-body-prime`, `awards-item-content-prime`, `awards-item-year-prime`).
3. Три карточки-ссылки с текстами и URL ровно из 6.2; каждая открывается в новой вкладке
   с `rel="noopener noreferrer"`.
4. Иконки лежат локально в `public/images/media/` (3 файла из таблицы 6.1), рендерятся белыми.
5. Счётчик показывает «3» без «+».
6. Вертикальные отступы: 120px сверху/снизу внутри подложки на десктопе, 60px на ≤991px
   (из `.our-awards-prime`), без Spacer и без новых margin.
7. `Awards.astro`, `custom.css`, `Footer.astro` и незакоммиченные чужие изменения не тронуты.
8. `npm run build` проходит; новые файлы ≤ 150 строк.
9. Цвет текста карточек — `--text-color`/`--primary-color`, не синий цвет ссылки bootstrap;
   при наведении подпись справа становится белой (существующее правило темы).

## 14. Rollback considerations

Откат — удалить `src/components/media/`, `src/lib/media-resources.ts`,
`public/images/media/` и две строки в `index.astro`. Миграций и состояния нет.

Принятые по умолчанию решения (можно поменять без смены архитектуры):
- Иллюстрации: в макете Awards нет места под иллюстрацию, поэтому используются только
  иконки (так блок совпадает 1:1). Если владелец захочет иллюстрацию — это отдельная
  правка разметки.
- Формулировки о содержании каналов (Cursor, Claude Code, MCP, RAG) опираются на стек,
  заявленный на самом сайте; владелец может поправить строки в `src/lib/media-resources.ts`.

## 15. Files allowed to be modified

Создать:
- `src/lib/media-resources.ts`
- `src/components/media/MediaResources.astro`
- `public/images/media/icon-youtube.svg`
- `public/images/media/icon-telegram-channel.svg`
- `public/images/media/icon-telegram-chat.svg`

Изменить:
- `src/pages/index.astro` (только 2 строки из 6.4)

Запрещено трогать всё остальное, в частности уже изменённые до этой задачи и не относящиеся
к ней файлы: `src/components/shared/Header.astro`, `src/layouts/BlogLayout.astro`,
`src/lib/server/full-sitemap.ts`, `openspec/changes/add-instructions-guides/`,
`src/lib/server/w1do/guides.ts`. Не коммитить их, не форматировать, не откатывать.

## 16. Ordered implementation steps (Implementer)

1. `mkdir -p public/images/media src/components/media`.
2. Скачать 3 SVG по таблице 6.1 (MCP `assets_download` по `object_key`, иначе `curl` по URL)
   под указанными именами. Выполнить проверку из 6.1.
3. Создать `src/lib/media-resources.ts` с содержимым из 6.2 дословно.
4. Создать `src/components/media/MediaResources.astro` с содержимым из 6.3 дословно.
5. Внести две правки в `src/pages/index.astro` по 6.4.
6. `npm run build` — код 0. При ошибке не менять дизайн, а остановиться и сообщить
   (эскалация к архитектору).
7. `wc -l src/lib/media-resources.ts src/components/media/MediaResources.astro` — ≤150.
8. `npm run dev`, скриншоты `/` на 1440px и 375px, сравнить с блоком Awards на той же
   странице; проверить 3 ссылки.
9. `git status --short` — сверить со списком из раздела 15; в отчёт включить вывод команд.
