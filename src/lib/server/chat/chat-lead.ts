import { createHash } from "node:crypto";
import { LEGAL_CONSENT_VALUE, LEGAL_DOCS } from "../../legal";
import {
    CHAT_CONSENT_NOTICE, CHAT_CONSENT_VERSION, CHAT_LEAD_MESSAGES,
    type ChatLeadDraft, type ChatLeadNotice, type ChatLeadStatus, type ChatMessage, type ChatSource,
} from "../../chat";
import { submitLead } from "../leads/submit-lead";
import { checkLeadLimit } from "./rate-limit";
import { isGroundedInVisitorMessages, phoneDigits } from "./lead-directives";
import { claimLeadPhone, releaseLeadPhone } from "./chat-store";

export interface ChatLeadContext {
    draft: ChatLeadDraft;
    messages: ChatMessage[];
    clientKey: string;
    source: ChatSource;
    attribution: Record<string, string>;
    consentAcceptedAt: string;
    consentVersion: string;
    honeypot: string;
}

const notice = (status: ChatLeadStatus): ChatLeadNotice => ({ status, message: CHAT_LEAD_MESSAGES[status] });

// Fingerprint of the consent text and the linked documents, sent to the platform with each lead.
const CONSENT_SHA256 = createHash("sha256")
    .update([CHAT_CONSENT_VERSION, CHAT_CONSENT_NOTICE, ...Object.values(LEGAL_DOCS).map((doc) => doc.href)].join("\n"))
    .digest("hex");

// Throws RedisUnavailableError when the phone marker cannot be checked; the route turns it into 503.
export async function submitChatLead(context: ChatLeadContext): Promise<{ notice: ChatLeadNotice; submitted: boolean }> {
    const { draft, messages } = context;

    if (context.honeypot) {
        return { notice: notice("sent"), submitted: false };
    }

    if (!isGroundedInVisitorMessages(draft, messages)) {
        console.error("[chat-lead] draft rejected: contacts not found in visitor messages");
        return { notice: notice("invalid"), submitted: false };
    }

    const digits = phoneDigits(draft.phone).slice(-10);
    if (!(await claimLeadPhone(digits))) {
        return { notice: notice("duplicate"), submitted: false };
    }

    // The lead counter is charged only after the phone marker is taken, so a duplicate does not use up the limit.
    if (!checkLeadLimit(context.clientKey).allowed) {
        await releasePhoneQuietly(digits);
        return { notice: notice("limited"), submitted: false };
    }

    const outcome = await submitLead(
        {
            name: draft.name,
            phone: draft.phone,
            email: draft.email,
            subject: `Заявка из ИИ-чата: ${draft.name}`,
            message: `${draft.summary}\n\nИмя: ${draft.name}`,
            source: context.source,
            payload: {
                ...context.attribution,
                legal_consent: LEGAL_CONSENT_VALUE,
                legal_consent_at: context.consentAcceptedAt,
                legal_consent_version: context.consentVersion,
                legal_consent_sha256: CONSENT_SHA256,
                legal_docs: Object.values(LEGAL_DOCS).map((doc) => doc.href).join(","),
            },
            legalConsent: true,
        },
        "[chat-lead]",
    );

    if (outcome.ok) {
        return { notice: notice("sent"), submitted: true };
    }

    // Network failure: the platform may have stored the lead, so the marker stays to block a resend.
    if (outcome.reason === "network") {
        return { notice: notice("failed"), submitted: false };
    }

    await releasePhoneQuietly(digits);
    return { notice: notice(outcome.reason === "validation" ? "invalid" : "failed"), submitted: false };
}

async function releasePhoneQuietly(digits: string): Promise<void> {
    try {
        await releaseLeadPhone(digits);
    } catch {
        // the marker expires on its own after 30 minutes
    }
}
