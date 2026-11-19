// Единый источник цен. Все страницы берут значения отсюда.
// TODO(pricing): подтвердить сетку у владельца — сейчас за основу взята
// страница /pricing, чтобы убрать расхождения между главной и услугами.
export type PriceUnit = "project" | "month";

export interface PricingPackage {
    id: string;
    name: string;
    /** null — цена по запросу. */
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
        priceFrom: 3000,
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
        priceFrom: 150000,
        unit: "project",
        term: "2–3 недели",
        description: "Рабочий прототип агента или сервиса, который можно показать команде и клиентам.",
        features: ["Проектирование архитектуры", "Интеграция LLM", "Базовый RAG", "Тестирование и деплой"],
        audience: "Если нужно быстро проверить гипотезу",
        icon: "/images/icon-pricing-2.svg",
        highlighted: true,
        ctaLabel: "Обсудить MVP",
    },
    {
        id: "business",
        name: "Business AI",
        priceFrom: 450000,
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
    priceFrom: 250000,
    unit: "month" as PriceUnit,
    term: "от 1 месяца",
    description: "Сопровождение после запуска: мониторинг, обновления моделей, доработки.",
    features: ["Мониторинг качества", "Обновление моделей", "Доработки", "Отчётность"],
};

export function formatPrice(pkg: Pick<PricingPackage, "priceFrom" | "unit">): string {
    if (pkg.priceFrom === null) return "По запросу";
    const value = new Intl.NumberFormat("ru-RU").format(pkg.priceFrom).replace(/\u00A0/g, " ");
    return pkg.unit === "month" ? `от ${value} ₽/мес` : `от ${value} ₽`;
}

export function getPackages(): PricingPackage[] {
    return PACKAGES;
}
