import { useEffect, useId, useRef, useState } from "react";
import AiChat from "./AiChat";

const STORAGE_KEY = "w1do-chat-popup";

function saveState(value: "opened" | "closed") {
    try {
        sessionStorage.setItem(STORAGE_KEY, value);
    } catch {}
}

export default function ChatPopup() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const focusTarget = useRef<"input" | "toggle" | null>(null);
    const panelId = useId();

    const show = (focusInput = false) => {
        focusTarget.current = focusInput ? "input" : null;
        setMounted(true);
        setOpen(true);
    };

    const hide = () => {
        focusTarget.current = "toggle";
        setOpen(false);
        saveState("closed");
    };

    useEffect(() => {
        let stored: string | null = null;
        try {
            stored = sessionStorage.getItem(STORAGE_KEY);
        } catch {
            show();
            return;
        }
        if (stored === null) {
            show();
            saveState("opened");
        }
    }, []);

    useEffect(() => {
        const openFromButton = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-open-chat], a.btn-default') : null;
            if (!link) return;
            if (!link.hasAttribute('data-open-chat') && new URL(link.href).hostname !== 't.me') return;
            event.preventDefault();
            show(true);
            saveState('opened');
            requestAnimationFrame(() => panelRef.current?.querySelector('textarea')?.focus());
        };
        document.addEventListener('click', openFromButton);
        return () => document.removeEventListener('click', openFromButton);
    }, []);

    useEffect(() => {
        const target = focusTarget.current;
        focusTarget.current = null;
        if (!open) {
            if (target === "toggle") toggleRef.current?.focus();
            return;
        }
        if (target === "input") panelRef.current?.querySelector("textarea")?.focus();
        const onKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") hide();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open]);

    return (
        <div className="ai-chat-popup">
            {mounted && (
                <div id={panelId} ref={panelRef} className="ai-chat-popup__panel" role="dialog" aria-label="ИИ-помощник W1DO DIGITAL" hidden={!open}>
                    <div className="ai-chat-popup__header">
                        <span className="ai-chat-popup__title">ИИ-помощник W1DO DIGITAL</span>
                        <button type="button" className="ai-chat-popup__close" aria-label="Свернуть чат" onClick={hide}>×</button>
                    </div>
                    <AiChat variant="popup" source="chat-popup" />
                </div>
            )}
            <button ref={toggleRef} type="button" className="ai-chat-popup__toggle" aria-label={open ? "Свернуть чат" : "Открыть чат с ИИ-помощником"}
                aria-expanded={open} aria-controls={mounted ? panelId : undefined} onClick={() => (open ? hide() : show(true))}>
                <i className={open ? "fa-solid fa-xmark" : "fa-solid fa-comments"} aria-hidden="true"></i>
            </button>
        </div>
    );
}
