import "../../styles/ai-chat.css";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { useAiChat } from "../../hooks/useAiChat";
import { CHAT_CONTACT_PATH, CHAT_MAX_USER_CHARS, type ChatSource } from "../../lib/chat";
import ChatConsent from "./ChatConsent";
import ChatLeadCard from "./ChatLeadCard";

interface AiChatProps {
    variant?: "page" | "widget";
    source?: ChatSource;
}

const GREETINGS = {
    page: "Здравствуйте! Я ИИ-консультант W1DO. Спросите об услугах, сроках или о том, как заказать разработку.",
    widget: "Здравствуйте! Расскажите о задаче: отвечу на вопросы и помогу оставить заявку прямо здесь.",
};
const SUGGESTIONS = {
    page: ["Как заказать ваши услуги?", "Какие услуги вы оказываете?", "Сколько стоит разработка ИИ-агента?"],
    widget: ["Хочу оставить заявку", "Какие услуги вы оказываете?", "Сколько стоит разработка ИИ-агента?"],
};
const LINK_PATTERN = /(https:\/\/w1do\.ru(?:\/[^\s<>"'«»()]*)?)/g;

// Plain text only: React escapes everything, and only w1do.ru URLs become links.
function renderText(text: string): ReactNode[] {
    return text.split(LINK_PATTERN).map((part, index) => {
        if (index % 2 === 0) return part;
        const url = part.replace(/[.,;:!?]+$/, "");
        const tail = part.slice(url.length);
        return <Fragment key={index}><a href={url}>{url}</a>{tail}</Fragment>;
    });
}

export default function AiChat({ variant = "page", source = "chat-page" }: AiChatProps) {
    const {
        messages, status, error, consentAccepted, consentRequired, leadDraft, leadNotice,
        send, acceptConsent, confirmLead, dismissLeadDraft,
    } = useAiChat(source);
    const [draft, setDraft] = useState("");
    const listRef = useRef<HTMLDivElement>(null);
    const honeypotRef = useRef<HTMLInputElement>(null);
    const inputId = useId();
    const loading = status === "loading";

    useEffect(() => {
        const list = listRef.current;
        if (list) list.scrollTop = list.scrollHeight;
    }, [messages.length, status]);

    const submit = () => {
        if (loading || !draft.trim()) return;
        const text = draft;
        setDraft("");
        void send(text);
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
        }
    };

    const leadSent = leadNotice?.status === "sent" || leadNotice?.status === "duplicate";

    return (
        <div className={`ai-chat ai-chat--${variant}`}>
            <div className="ai-chat__messages" ref={listRef} aria-live="polite">
                <div className="ai-chat__message ai-chat__message--assistant">{GREETINGS[variant]}</div>
                {messages.map((message, index) => (
                    <div key={index} className={`ai-chat__message ai-chat__message--${message.role}`}>{renderText(message.content)}</div>
                ))}
                {loading && <div className="ai-chat__message ai-chat__message--assistant ai-chat__message--typing">Печатает…</div>}
            </div>
            {consentRequired && !consentAccepted && <ChatConsent disabled={loading} onAccept={acceptConsent} />}
            {leadDraft && (
                <ChatLeadCard
                    draft={leadDraft}
                    disabled={loading}
                    onConfirm={(summary) => void confirmLead(summary, honeypotRef.current?.value ?? "")}
                    onDismiss={dismissLeadDraft}
                />
            )}
            {leadNotice && (
                <p className={`ai-chat__lead ai-chat__lead--${leadNotice.status}`}>
                    {leadNotice.message}
                    {!leadSent && <>{" "}<a href={CHAT_CONTACT_PATH}>Оставить заявку через форму</a></>}
                </p>
            )}
            {messages.length === 0 && (
                <div className="ai-chat__suggestions">
                    {SUGGESTIONS[variant].map((question) => (
                        <button key={question} type="button" className="ai-chat__suggestion" disabled={loading} onClick={() => void send(question)}>{question}</button>
                    ))}
                </div>
            )}
            {status === "error" && error && <p className="ai-chat__error" role="alert">{error}</p>}
            <form className="ai-chat__form" style={{ position: "relative" }} onSubmit={onSubmit}>
                <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                    <label>Max<input ref={honeypotRef} type="text" name="max" tabIndex={-1} autoComplete="off" /></label>
                </div>
                <textarea id={inputId} name="message" aria-label="Ваш вопрос" rows={2} maxLength={CHAT_MAX_USER_CHARS}
                    placeholder="Например: как заказать ваши услуги?" value={draft}
                    onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} />
                <button type="submit" className="btn-default" disabled={loading || !draft.trim()}>{loading ? "Отправляем…" : "Отправить"}</button>
                <span className="ai-chat__counter">{draft.length}/{CHAT_MAX_USER_CHARS}</span>
            </form>
            <p className="ai-chat__note">Отвечает ИИ, он может ошибаться. Контакты передаются только после вашего согласия. Заявку можно оставить и через <a href={CHAT_CONTACT_PATH}>форму</a>.</p>
        </div>
    );
}
