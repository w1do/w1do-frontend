import { useEffect, useId, useState } from "react";
import { CHAT_LEAD_SUMMARY_MAX, CHAT_LEAD_SUMMARY_MIN, type ChatLeadDraft } from "../../lib/chat";

interface ChatLeadCardProps {
    draft: ChatLeadDraft;
    disabled: boolean;
    onConfirm: (summary: string) => void;
    onDismiss: () => void;
}

export default function ChatLeadCard({ draft, disabled, onConfirm, onDismiss }: ChatLeadCardProps) {
    const [summary, setSummary] = useState(draft.summary);
    const id = useId();

    useEffect(() => setSummary(draft.summary), [draft]);

    return (
        <div className="ai-chat__lead-card" role="group" aria-label="Заявка перед отправкой">
            <p className="ai-chat__lead-title">Проверьте заявку</p>
            <dl className="ai-chat__lead-fields">
                <dt>Имя</dt><dd>{draft.name}</dd>
                <dt>Телефон</dt><dd>{draft.phone}</dd>
                {draft.email && (<><dt>Email</dt><dd>{draft.email}</dd></>)}
            </dl>
            <label htmlFor={id}>Суть задачи (можно отредактировать)</label>
            <textarea id={id} rows={4} maxLength={CHAT_LEAD_SUMMARY_MAX} value={summary} onChange={(event) => setSummary(event.target.value)} />
            <span className="ai-chat__counter">{summary.length}/{CHAT_LEAD_SUMMARY_MAX}</span>
            <div className="ai-chat__lead-actions">
                <button type="button" className="btn-default" disabled={disabled || summary.trim().length < CHAT_LEAD_SUMMARY_MIN} onClick={() => onConfirm(summary)}>Отправить заявку</button>
                <button type="button" className="ai-chat__suggestion" disabled={disabled} onClick={onDismiss}>Исправить в чате</button>
            </div>
        </div>
    );
}
