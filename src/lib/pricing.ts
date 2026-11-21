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
