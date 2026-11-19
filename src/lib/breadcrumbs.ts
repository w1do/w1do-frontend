import { SITE_ORIGIN } from "./regions";

export interface BreadcrumbItem {
    name: string;
    path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": new URL(item.path, SITE_ORIGIN).href
        }))
    };
}
