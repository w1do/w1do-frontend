// /ai-agents — канонический раздел для услуг по ИИ-агентам.
const CANONICAL_BY_SLUG: Record<string, string> = {
    "ai-agent-for-business": "/ai-agents/ai-agent-for-business",
    "ai-automation-services": "/ai-agents/ai-agent-automation",
};

export function aiAgentsCanonical(postSlug?: string): string {
    if (postSlug && CANONICAL_BY_SLUG[postSlug]) return CANONICAL_BY_SLUG[postSlug];
    return "/ai-agents";
}
