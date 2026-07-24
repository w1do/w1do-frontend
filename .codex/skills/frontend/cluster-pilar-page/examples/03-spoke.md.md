# Пример 03 — Spoke (посадочная под-страница услуги)

Реальный файл: `src/content/services/ai-assistants-chatbots/telegram-chatbot.md`.
Это spoke — попадает в коллекцию `serviceLanding`, `entry.id` =
`ai-assistants-chatbots/telegram-chatbot`, URL =
`/services/ai-assistants-chatbots/telegram-chatbot`.

**Чтобы добавить под-страницу в существующую услугу — достаточно создать вот
такой один `.md`-файл** в папке услуги. Роут появится автоматически.

## Полный файл (as-is)

```md
---
layout: ../../../layouts/ServiceLandingLayout.astro
cluster: ai-assistants-chatbots
title: "Чат-бот для Telegram под ключ"
seo:
  title: "Разработка чат-бота для Telegram под ключ — умный бот на базе ИИ | W1DO"
  description: "Я разрабатываю умные Telegram-боты на базе ИИ: приём заявок, продажи и поддержка клиентов 24/7 прямо в мессенджере. Запуск за 5–10 дней."
description: "Умный Telegram-бот на базе ИИ для приёма заявок, продаж и поддержки клиентов прямо в мессенджере."
excerpt: "Умный Telegram-бот, который отвечает клиентам, принимает заявки и продаёт прямо в мессенджере 24/7."
dateLabel: "6 минут чтения"
image: /images/services/ai-chat-bot.webp
imageAlt: "Чат-бот для Telegram на базе ИИ"
icon: /images/icon-service-offer-list-1.svg
order: 1
tags: ["Telegram", "чат-бот", "разработчик_ии"]
offersTitle: "Что умеет мой Telegram-бот"
offersDescription: "Я собираю бота, который закрывает конкретные задачи вашего бизнеса в Telegram."
offers:
  - title: "Приём заявок и лидов"
    description: "Бот задаёт нужные вопросы, собирает контакты и передаёт заявку мне в CRM или вам в чат."
    icon: "/images/icon-service-offer-list-1.svg"
  - title: "Продажи и каталог"
    description: "Показываю товары и услуги прямо в диалоге, оформляю заказ и передаю оплату."
    icon: "/images/icon-service-offer-list-2.svg"
featuresTitle: "Почему Telegram-бот работает"
featuresDescription: "Я делаю ботов, которые понимают свободную речь, а не только кнопки."
features:
  - "Понимание естественного языка (NLP)"
  - "Ответы из вашей базы знаний (RAG)"
  - "Интеграция с CRM и Google Calendar"
  - "Работа 24/7 без операторов"
faqs:
  - question: "Сколько стоит разработка Telegram-бота?"
    answer: "Базовый умный бот с вашей базой знаний обойдётся от 35 000 ₽. Точную цену я называю после короткого брифа по задачам."
  - question: "Нужен ли отдельный сервер для бота?"
    answer: "Нет, я разворачиваю бота на своей инфраструктуре или в вашем контуре — как вам удобнее."
  - question: "За сколько дней вы запустите бота?"
    answer: "Базовую версию с базой знаний я запускаю за 5–10 рабочих дней."
process:
  title: "Как я делаю Telegram-бота"
  description: "От брифа до первого диалога с клиентом за несколько шагов."
  step1Title: "Бриф и сценарии"
  step1Desc: "Разбираю задачи бизнеса и продумываю сценарии диалога."
  step2Title: "База знаний"
  step2Desc: "Загружаю ваши материалы, чтобы бот отвечал точно."
  step3Title: "Интеграция"
  step3Desc: "Подключаю бота к Telegram, CRM и календарю."
  step4Title: "Запуск"
  step4Desc: "Тестирую на реальных вопросах и вывожу в работу."
---

Я разрабатываю чат-бота для Telegram, который берёт на себя рутину общения с клиентами: отвечает на вопросы, принимает заявки и доводит до продажи прямо в мессенджере. В отличие от кнопочных ботов, мой бот работает на базе разработчик_ии, понимает свободную речь и ведёт диалог как живой менеджер.

Telegram остаётся самым удобным каналом для быстрых коммуникаций, поэтому умный бот здесь окупается быстрее всего: клиент получает мгновенный ответ в привычном приложении, а вы — заявки без ночных смен и пропущенных сообщений.

Я подключаю бота к вашей базе знаний, CRM и календарю, чтобы он не просто болтал, а совершал целевые действия: фиксировал лид, записывал на услугу и передавал данные в вашу систему.

Хотите охватить и другие каналы? Посмотрите [чат-бота для сайта](/services/ai-assistants-chatbots/website-chatbot) или [бота технической поддержки](/services/ai-assistants-chatbots/support-chatbot). Все решения и тарифы собраны в разделе услуги [AI ассистенты и чат-боты](/services/ai-assistants-chatbots).
```

## Что здесь критично (не ошибись)

1. **`layout: ../../../layouts/ServiceLandingLayout.astro`** — ТРИ `../` (spoke
   лежит на уровень глубже, чем pillar; у pillar было две `../`). Другой макет —
   `ServiceLandingLayout`, не `ServiceLayout`.
2. **`cluster: ai-assistants-chatbots`** — ОБЯЗАН точно совпадать с именем папки
   услуги. По нему spoke попадает в список хаба и в сайдбар соседей. Ошибся в
   `cluster` → страница «повиснет» вне кластера.
3. **`order: 1`** — уникальный в пределах услуги; задаёт позицию карточки на хабе
   и пункта в сайдбаре (сортировка по возрастанию).
4. **`excerpt`** — именно он показывается в карточке spoke на хабе (если задан;
   иначе берётся `description`).
5. **`icon`** — обычно `/images/icon-service-offer-list-1.svg` или `-2.svg`.
6. **Последний абзац тела — ПЕРЕЛИНКОВКА.** Обязательно 1–2 внутренние ссылки:
   на соседние spokes и/или на хаб услуги. Это ядро topic cluster.
7. **Tone of voice — строго первое лицо:** «я разрабатываю», «мой бот»,
   «я подключаю». Никаких «мы / наша компания / студия». К клиенту — «вы / ваш».

## Мини-скелет для копирования (пустой spoke)

```md
---
layout: ../../../layouts/ServiceLandingLayout.astro
cluster: <slug-услуги>
title: "<H1 под один интент>"
seo:
  title: "<SEO title, 70–90 симв., | W1DO>"
  description: "<meta 140–160 симв.>"
description: "<короткое описание>"
excerpt: "<текст карточки на хабе>"
dateLabel: "<напр. 5 минут чтения>"
image: /images/services/<из pillar>.webp
imageAlt: "<alt>"
icon: /images/icon-service-offer-list-1.svg
order: <уникальное число>
tags: ["…"]
offers:
  - { title: "…", description: "…", icon: "/images/icon-service-offer-list-1.svg" }
  - { title: "…", description: "…", icon: "/images/icon-service-offer-list-2.svg" }
features: ["…", "…", "…", "…"]
faqs:
  - { question: "…", answer: "…" }
process:
  title: "…"
  step1Title: "…"
  step1Desc: "…"
  step2Title: "…"
  step2Desc: "…"
  step3Title: "…"
  step3Desc: "…"
  step4Title: "…"
  step4Desc: "…"
---

Абзац 1 — суть решения (от первого лица).

Абзац 2 — почему это выгодно клиенту.

Абзац 3 — как я это делаю / что интегрирую.

Абзац 4 (перелинковка) — ссылки на [соседний spoke](/services/<slug>/<spoke2>)
и на хаб [<название услуги>](/services/<slug>).
```
