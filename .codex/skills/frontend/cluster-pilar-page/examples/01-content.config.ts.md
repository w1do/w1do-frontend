# Пример 01 — Коллекции услуг в `src/content.config.ts`

Здесь определяются **две** коллекции, которые делят одну и ту же папку
`src/content/services/` на pillar и spokes. Разделение целиком держится на
glob-паттернах загрузчика `glob(...)`.

## Реальный код (as-is)

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── PILLAR (хабы услуг) ─────────────────────────────────────────────
const servicesCollection = defineCollection({
  loader: glob({
    pattern: '*/index.md',                                   // (1)
    base: "./src/content/services",
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),  // (2)
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seo: z.object({ title: z.string(), description: z.string() }).optional(),
    hub: z.boolean().optional(),                             // (3)
    layout: z.string().optional(),
    image: z.string().optional(),
    no: z.string().optional(),
    icon: z.string().optional(),
    tags: z.array(z.string()).optional(),
    offersTitle: z.string().optional(),
    offersDescription: z.string().optional(),
    offers: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
    })).optional(),
    featuresTitle: z.string().optional(),
    featuresDescription: z.string().optional(),
    features: z.array(z.string()).optional(),
    stats: z.array(z.object({
      value: z.string(),
      suffix: z.string().optional(),
      label: z.string(),
    })).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    process: z.object({
      title: z.string(),
      description: z.string().optional(),
      step1Title: z.string().optional(), step1Desc: z.string().optional(),
      step2Title: z.string().optional(), step2Desc: z.string().optional(),
      step3Title: z.string().optional(), step3Desc: z.string().optional(),
      step4Title: z.string().optional(), step4Desc: z.string().optional(),
    }).optional(),
    pricing: z.object({
      title: z.string(),
      description: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        price: z.string(),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
      })).optional(),
    }).optional(),
  }),
});

// ── SPOKES (посадочные под-страницы) ────────────────────────────────
const serviceLandingCollection = defineCollection({
  loader: glob({ pattern: ['*/*.md', '!*/index.md'], base: "./src/content/services" }), // (4)
  schema: z.object({
    layout: z.string().optional(),
    cluster: z.string(),                                     // (5) ОБЯЗАТЕЛЬНО
    title: z.string(),
    description: z.string(),
    seo: z.object({ title: z.string(), description: z.string() }).optional(),
    excerpt: z.string().optional(),
    dateLabel: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().default(0),                            // (6)
    tags: z.array(z.string()).optional(),
    // offers / features / stats / faqs / process / pricing — те же, что у pillar
  }),
});

export const collections = {
  'blog': blogCollection,
  'case': caseCollection,
  'services': servicesCollection,
  'serviceLanding': serviceLandingCollection,
};
```

## Построчный разбор ключевых мест

**(1) `pattern: '*/index.md'`** — коллекция `services` (pillar) ловит только файлы
`<slug>/index.md`. То есть один pillar на папку услуги.

**(2) `generateId: ({ entry }) => entry.replace(/\/index\.md$/, '')`** — самый
важный трюк рефакторинга «одна услуга = одна папка». По умолчанию `entry.id`
физического файла `ai-assistants-chatbots/index.md` был бы
`ai-assistants-chatbots/index`, и URL/поиск по id сломались бы. Регулярка
отбрасывает `/index.md`, поэтому `entry.id` = `ai-assistants-chatbots`. Благодаря
этому `services.astro` (список), хаб-роут (`getEntry('services', cluster)`),
`[...slug].astro` и т.д. работают без единой правки.

**(3) `hub: z.boolean().optional()`** — флаг «эта услуга — хаб». В pillar кластера
ставим `hub: true`. По нему `[...slug].astro` исключает хабы
(`data.hub !== true`), чтобы не было двух маршрутов на один URL.

**(4) `pattern: ['*/*.md', '!*/index.md']`** — коллекция `serviceLanding` (spokes)
ловит все `.md` внутри папок услуг, но **исключает** `index.md` (это pillar).
Массив с ведущим `!` — негативный паттерн, поддерживается tinyglobby в Astro.

**(5) `cluster: z.string()`** — обязательное поле spoke, значение = имя папки
услуги. Именно по нему хаб и сайдбар собирают список своих под-страниц.

**(6) `order: z.number().default(0)`** — задаёт порядок карточек spoke на хабе и
в сайдбаре. Держи `order` **уникальным** внутри одной услуги.

## Итог: файл → коллекция → id → URL

| Файл | Коллекция | `entry.id` | URL |
|------|-----------|-----------|-----|
| `ai-assistants-chatbots/index.md` | `services` | `ai-assistants-chatbots` | `/services/ai-assistants-chatbots` |
| `ai-assistants-chatbots/telegram-chatbot.md` | `serviceLanding` | `ai-assistants-chatbots/telegram-chatbot` | `/services/ai-assistants-chatbots/telegram-chatbot` |
