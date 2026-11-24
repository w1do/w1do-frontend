export const STARTING_CONSULTATION_PRICE = 2500;
export const STARTING_PROJECT_PRICE = 5000;
export const INDIVIDUAL_PRICE_LABEL = "Индивидуально";

export type PriceUnit = "project" | "month";

export interface PricingPackage {
    id: string;
    name: string;
    /** null — стоимость рассчитывается индивидуально. */
    priceFrom: number | null;
    unit: PriceUnit;
    term: string;
    description: string;
    features: string[];
    audience: string;
    icon: string;
    highlighted?: boolean;
    ctaLabel: string;
}

export const PACKAGES: PricingPackage[] = [
    {
        id: "audit",
        name: "Аудит и roadmap",
        priceFrom: STARTING_CONSULTATION_PRICE,
        unit: "project",
        term: "1–3 дня",
        description: "Разбираем процесс, находим точку роста и считаем эффект до разработки.",
        features: ["Аудит процессов", "Карта сценариев", "Оценка эффекта", "План внедрения"],
        audience: "Если ещё не выбрали, что автоматизировать",
        icon: "/images/icon-pricing-1.svg",
        ctaLabel: "Заказать аудит",
    },
    {
        id: "mvp",
        name: "AI MVP",
        priceFrom: STARTING_PROJECT_PRICE,
        unit: "project",
        term: "2–3 недели",
        description: "Начинаем с прототипа одного сценария. Базу знаний, интеграции и запуск оцениваем отдельно.",
        features: ["Выбор сценария", "Прототип с LLM", "Проверка результата", "Оценка следующих этапов"],
        audience: "Если нужно быстро проверить гипотезу",
        icon: "/images/icon-pricing-2.svg",
        highlighted: true,
        ctaLabel: "Обсудить MVP",
    },
    {
        id: "business",
        name: "Business AI",
        priceFrom: null,
        unit: "project",
        term: "4–8 недель",
        description: "Внедрение агента в процессы компании с интеграцией в CRM, 1С и мессенджеры.",
        features: ["Агентные сценарии", "Интеграция CRM/1С", "Обучение сотрудников", "Поддержка запуска"],
        audience: "Если нужен результат в работе, а не демо",
        icon: "/images/icon-pricing-3.svg",
        ctaLabel: "Получить КП",
    },
];

export const RETAINER = {
    id: "support",
    name: "Поддержка и развитие",
    priceFrom: null,
    unit: "month" as PriceUnit,
    term: "от 1 месяца",
    description: "Сопровождение после запуска: мониторинг, обновления моделей, доработки.",
    features: ["Мониторинг качества", "Обновление моделей", "Доработки", "Отчётность"],
};

interface PricingService {
    name: string;
    description: string;
    priceFrom?: number;
}

export const PRICING_SERVICES: readonly PricingService[] = [
    {
        name: "Настройка локальных LLM под бизнес",
        description: "Подбираем модель, разворачиваем её на вашей инфраструктуре и проверяем на рабочих задачах.",
        priceFrom: 10200,
    },
    {
        name: "Дообучение LLM под бизнес",
        description: "Готовим примеры, адаптируем модель под нужный формат или стиль и замеряем качество.",
        priceFrom: 14800,
    },
    {
        name: "Пилот ИИ-агента",
        description: "Собираем агента для одного процесса и проверяем его на ваших примерах.",
    },
    {
        name: "Разработка agent harness",
        description: "Настраиваем среду работы агента, его инструменты, правила действий и обработку ошибок.",
    },
    {
        name: "Подключение инструментов через MCP и API",
        description: "Подключаем рабочие системы и ограничиваем набор разрешённых действий.",
    },
    {
        name: "Настройка контекста и памяти агента",
        description: "Определяем, какие данные сохранять между шагами, сессиями и обращениями.",
    },
    {
        name: "Проектирование инструкций и форматов ответа",
        description: "Настраиваем поведение агента и проверяем структуру данных для передачи в другие системы.",
    },
    {
        name: "Маршрутизация между моделями",
        description: "Выбираем модель для каждого типа задачи с учётом качества, скорости и бюджета.",
    },
    {
        name: "Оркестрация нескольких агентов",
        description: "Распределяем этапы процесса и передаём контекст между агентами.",
    },
    {
        name: "Права доступа и согласование действий",
        description: "Ограничиваем доступ к данным и настраиваем подтверждение операций сотрудником.",
    },
    {
        name: "Тестирование качества ИИ-агентов",
        description: "Готовим проверочные примеры и измеряем качество ответов и действий после изменений.",
    },
    {
        name: "Мониторинг работы агента",
        description: "Отслеживаем вызовы инструментов, ошибки, время ответа и расходы на модели.",
    },
    {
        name: "Корпоративная база знаний с RAG",
        description: "Подключаем документы и настраиваем ответы со ссылками на найденные источники.",
    },
    {
        name: "Извлечение данных из документов",
        description: "Извлекаем поля из PDF, сканов и писем, проверяем их и передаём в учётную систему.",
    },
    {
        name: "ИИ-агент для продаж и CRM",
        description: "Квалифицируем обращения, готовим резюме диалогов и обновляем карточки сделок по вашим правилам.",
    },
    {
        name: "ИИ-агент для поддержки",
        description: "Настраиваем ответы по базе знаний и передачу сложных обращений оператору.",
    },
    {
        name: "Голосовой ИИ-агент",
        description: "Настраиваем обработку звонков, запись результатов и перевод на сотрудника.",
    },
    {
        name: "ИИ-агент для аналитики",
        description: "Подключаем разрешённые источники данных и готовим сводки по запросу.",
    },
    {
        name: "Автоматизация процессов с n8n",
        description: "Связываем шаги агента с событиями в CRM, почте, мессенджерах и внутренних сервисах.",
    },
    {
        name: "Запуск и сопровождение ИИ-системы",
        description: "Разворачиваем решение, передаём инструкции и согласуем порядок обновлений и поддержки.",
    },
];

export function formatRubleAmount(amount: number): string {
    return new Intl.NumberFormat("ru-RU").format(amount).replace(/\u00A0/g, " ");
}

export function formatPrice(pkg: Pick<PricingPackage, "priceFrom" | "unit">): string {
    if (pkg.priceFrom === null) return INDIVIDUAL_PRICE_LABEL;
    const value = formatRubleAmount(pkg.priceFrom);
    return pkg.unit === "month" ? `от ${value} ₽/мес` : `от ${value} ₽`;
}

export function getPackages(): PricingPackage[] {
    return PACKAGES;
}
