const legacyAgentHub = "/services/ai-agent-development";
const serviceAliases = new Map([
    [legacyAgentHub, "/ai-agents"],
    [`${legacyAgentHub}/ai-agent-for-business`, "/ai-agents/ai-agent-for-business"],
    [`${legacyAgentHub}/ai-automation-services`, "/ai-agents/ai-agent-automation"],
    [`${legacyAgentHub}/ai-development`, "/ai-agents/ai-agent-implementation"],
    [`${legacyAgentHub}/ai-solutions-development`, "/ai-agents"],
    ["/services/consultation", "/consultation"],
    ["/services/consultation/online-ai-consultation", "/consultation/online-ai-consultation"],
    ["/services/ai-integration/ai-process-audit", "/services/ai-roadmap-consulting/ai-process-audit"],
]);

export function canonicalServicePath(path: string): string {
    return serviceAliases.get(path.replace(/\/$/, "")) || path;
}
