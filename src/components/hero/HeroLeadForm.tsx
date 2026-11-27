import { useEffect, useId, useRef } from "react";
import { useContactForm } from "../../hooks/useContactForm";
import LegalConsent from "../legal/LegalConsent";

interface HeroLeadFormProps {
    source?: string;
}

export default function HeroLeadForm({ source = "hero" }: HeroLeadFormProps) {
    const { status, message, handleSubmit } = useContactForm({ source });
    const uid = useId().replaceAll(":", "");
    const successRef = useRef<HTMLDivElement>(null);
    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";

    useEffect(() => {
        if (isSuccess) successRef.current?.focus({ preventScroll: true });
    }, [isSuccess]);

    if (isSuccess) {
        return (
            <div className="hero-lead__success" role="status" ref={successRef} tabIndex={-1}>
                <span className="hero-lead__success-icon" aria-hidden="true">
                    <i className="fa-solid fa-check" />
                </span>
                <strong>Заявка отправлена</strong>
                <p>Перезвоним и обсудим задачу. Если удобнее — напишите в Telegram.</p>
            </div>
        );
    }

    return (
        <form className="hero-lead__form" method="POST" onSubmit={handleSubmit} noValidate>
            {/* Honeypot: скрыт от людей, привлекателен для ботов. */}
            <div className="hero-lead__trap" aria-hidden="true">
                <label>
                    Max
                    <input type="text" name="max" tabIndex={-1} autoComplete="off" />
                </label>
            </div>

            <div className="hero-lead__field">
                <label htmlFor={`${uid}-name`}>Имя</label>
                <input
                    type="text"
                    name="fname"
                    id={`${uid}-name`}
                    placeholder="Как к вам обращаться"
                    autoComplete="given-name"
                    required
                />
            </div>

            <div className="hero-lead__field">
                <label htmlFor={`${uid}-phone`}>Телефон</label>
                <input
                    type="tel"
                    name="phone"
                    id={`${uid}-phone`}
                    placeholder="+7 (999) 000-00-00"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                />
            </div>

            <LegalConsent id={`${uid}-legal`} />

            <button type="submit" className="hero-lead__submit" disabled={isLoading}>
                {isLoading ? "Отправляем…" : "Получить расчёт"}
                {!isLoading && <span aria-hidden="true">→</span>}
            </button>

            {isError && (
                <p className="hero-lead__error" role="alert">
                    {message || "Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram."}
                </p>
            )}

            <p className="hero-lead__note">Перезвоним и разберём задачу. Без рассылок.</p>
        </form>
    );
}
