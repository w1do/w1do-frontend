import { getPackages, type PricingPackage } from "./pricing";

// Какой пакет показывать на странице направления услуг.
const PACKAGE_BY_CLUSTER: Record<string, string> = {
    "ai-roadmap-consulting": "audit",
    "consultation": "audit",
    "ai-assistants-chatbots": "mvp",
    "ai-bot-avito": "mvp",
    "ai-data-scraping": "mvp",
    "ai-marketing-content": "mvp",
    "code-refactoring": "mvp",
    "directus-setup": "mvp",
    "html-layout": "mvp",
    "infrastructure-dokploy": "mvp",
    "low-code-claude": "mvp",
    "mvp-prototyping": "mvp",
    "n8n-automation": "mvp",
    "payment-integration": "mvp",
    "vibe-coding": "mvp",
    "web-development": "mvp",
    "ai-agent-development": "business",
    "ai-integration-1c-crm": "business",
    "ai-integration": "business",
    "ai-video-surveillance": "business",
    "speech-recognition-analysis": "business",
    "mobile-apps": "business",
    "ai-solution-architecture": "business",
};

export function getStartingPackage(cluster?: string): PricingPackage | undefined {
    if (!cluster) return undefined;
    const packageId = PACKAGE_BY_CLUSTER[cluster];
    if (!packageId) return undefined;
    return getPackages().find((pkg) => pkg.id === packageId);
}
