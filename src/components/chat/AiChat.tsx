import "../../styles/ai-chat.css";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { useAiChat } from "../../hooks/useAiChat";
import { CHAT_CONTACT_PATH, CHAT_MAX_USER_CHARS, type ChatSource } from "../../lib/chat";
import ChatConsent from "./ChatConsent";
import ChatLeadCard from "./ChatLeadCard";
import { LINK_PATTERN, parseMarkdown, type MarkdownInline } from "./chat-markdown";

interface AiChatProps {
    variant?: "page" | "widget" | "popup";
    source?: ChatSource;
}

const GREETINGS = {
    page: "Добрый день! 👋 Я ИИ-помощник W1DO DIGITAL. Помогу разобраться в услугах, сроках и ценах и подскажу, с чего лучше начать. Какая задача перед вами стоит? 🙂",
    widget: "Добрый день! 😊 Расскажите о задаче — подскажу решение, сориентирую по ценам и помогу оставить заявку прямо здесь 🚀",
    popup: "Добрый день! 👋 Рад помочь решить вашу задачу: подберу подходящую услугу и сориентирую по ценам. Расскажите, что планируете? 😊",
};
const SUGGESTIONS = {
    page: ["Как заказать ваши услуги?", "Какие услуги вы оказываете?", "Сколько стоит разработка ИИ-агента?"],
    widget: ["Хочу оставить заявку", "Какие услуги вы оказываете?", "Сколько стоит разработка ИИ-агента?"],
    popup: ["Какие услуги вы оказываете?", "Сколько стоит разработка ИИ-агента?", "Хочу оставить заявку"],
};

// Plain text only: React escapes everything, and only w1do.ru URLs become links.
function renderText(text: string): ReactNode[] {
    return text.split(LINK_PATTERN).map((part, index) => {
        if (index % 2 === 0) return part;
        const url = part.replace(/[.,;:!?]+$/, "");
        const tail = part.slice(url.length);
        return <Fragment key={index}><a href={url}>{url}</a>{tail}</Fragment>;
    });
}

function renderInline(nodes: MarkdownInline[]): ReactNode[] {
    return nodes.map((node, index) => {
        switch (node.type) {
            case "text": return <Fragment key={index}>{node.text}</Fragment>;
            case "strong": return <strong key={index}>{renderInline(node.children)}</strong>;
            case "em": return <em key={index}>{renderInline(node.children)}</em>;
            case "link": return <a key={index} href={node.url}>{node.url}</a>;
            case "br": return <br key={index} />;
        }
    });
}

// Markdown subset as React elements: no raw HTML is rendered.
function renderMarkdown(text: string): ReactNode[] {
    return parseMarkdown(text).map((block, index) => {
        if (block.type === "paragraph") return <p key={index}>{renderInline(block.children)}</p>;
        const items = block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>);
        return block.ordered
            ? <ol key={index} start={block.start === 1 ? undefined : block.start}>{items}</ol>
            : <ul key={index}>{items}</ul>;
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
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const inputId = useId();
    const loading = status === "loading";

    useEffect(() => {
        const list = listRef.current;
        if (list) list.scrollTop = list.scrollHeight;
    }, [messages.length, status]);

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;
    }, [draft]);

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
                <div className="ai-chat__message ai-chat__message--assistant">{renderMarkdown(GREETINGS[variant])}</div>
                {messages.map((message, index) => (
                    <div key={index} className={`ai-chat__message ai-chat__message--${message.role}`}>
                        {message.role === "assistant" ? renderMarkdown(message.content) : renderText(message.content)}
                    </div>
                ))}
                {loading && (
                    <div className="ai-chat__message ai-chat__message--assistant ai-chat__typing" role="status">
                        <span className="ai-chat__typing-dots" aria-hidden="true"><span /><span /><span /></span>
                        <span className="ai-chat__typing-text">печатает</span>
                    </div>
                )}
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
                <div className="ai-chat__field">
                    <textarea id={inputId} ref={inputRef} name="message" aria-label="Ваш вопрос" rows={1} maxLength={CHAT_MAX_USER_CHARS}
                        placeholder="Например: как заказать ваши услуги?" value={draft}
                        onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} />
                    <button type="submit" className="ai-chat__send" aria-label="Отправить" disabled={loading || !draft.trim()}>
                        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                            <path fill="currentColor" d="M3.4 20.4 20.85 12.92a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
                        </svg>
                    </button>
                </div>
                <span className="ai-chat__counter">{draft.length}/{CHAT_MAX_USER_CHARS}</span>
            </form>
            <p className="ai-chat__note">Отвечает ИИ, он может ошибаться. Контакты передаются только после вашего согласия. Заявку можно оставить и через <a href={CHAT_CONTACT_PATH}>форму</a>.</p>
        </div>
    );
}
