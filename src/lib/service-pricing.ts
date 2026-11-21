export interface PublicServiceOffer {
    name: string;
    priceLabel: string;
    priceFrom: number | null;
    unit: "project" | "month" | "day" | "custom";
    term: string | null;
}

export function getStartingProjectOffer(pricing: { items?: unknown[] } | undefined, cluster?: string) {
    return getPublicServiceOffers(pricing, cluster)
        .filter((offer): offer is PublicServiceOffer & { priceFrom: number } =>
            offer.unit === "project" && offer.priceFrom !== null)
        .reduce<(PublicServiceOffer & { priceFrom: number }) | undefined>(
            (lowest, offer) => !lowest || offer.priceFrom < lowest.priceFrom ? offer : lowest, undefined
        );
}

export function getPublicServiceOffers(pricing: { items?: unknown[] } | undefined, cluster?: string): PublicServiceOffer[] {
    if (!Array.isArray(pricing?.items)) return [];

    return pricing.items.flatMap((item): PublicServiceOffer[] => {
        if (!item || typeof item !== "object") return [];
        const values = item as Record<string, unknown>;
        const name = typeof values.title === "string" ? values.title.trim() : "";
        const priceLabel = typeof values.price === "string" ? values.price.trim() : "";
        if (!name || !priceLabel) return [];

        const match = priceLabel.match(/^(?:от\s+)?([\d\s\u00a0\u202f]+)\s*₽\s*(?:\/\s*(мес(?:яц)?|день|проект))?\s*$/iu);
        const amount = match ? Number(match[1].replace(/\s/gu, "")) : NaN;
        const priceFrom = Number.isSafeInteger(amount) && amount > 0 ? amount : null;
        const period = match?.[2]?.toLowerCase();
        const description = typeof values.description === "string" ? values.description : "";
        const recurring = cluster === "web-support"
            || /абонентск|(?:^|\s)подписка(?:\s|$|[.,:])|(?:оплат|плат[её]ж).{0,20}подписк|помесяч|ежемесяч|еженедел|ежеднев|ежегод|(?:в|за)\s+(?:месяц|недел[юь]|день|год)|(?:регулярн|месячн).{0,20}(?:оплат|плат[её]ж)|регулярн.{0,30}(?:сбор|монитор|проверк|обновлен|обслуживан)/iu.test(`${name} ${description}`);
        const unit = period?.startsWith("мес") ? "month"
            : period === "день" ? "day"
            : period === "проект" ? "project"
            : priceFrom !== null && !recurring ? "project" : "custom";

        const explicitTerm = typeof values.term === "string" ? values.term.trim() : "";
        const features = Array.isArray(values.features) ? values.features : [];
        const termFeature = features.find((feature): feature is string => typeof feature === "string"
            && /^срок\s*:?\s*(?:(?:от|до)\s+)?\d+(?:\s*[-–—]\s*\d+)?\s*(?:рабочих\s+)?(?:дн(?:я|ей)?|недел(?:я|и|ь)|месяц(?:а|ев)?|час(?:а|ов)?)\.?$/iu.test(feature.trim()));
        const term = explicitTerm || termFeature?.trim().replace(/^срок\s*:?\s*/iu, "") || null;

        return [{ name, priceLabel, priceFrom, unit, term }];
    });
}
