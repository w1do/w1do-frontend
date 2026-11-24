import { useEffect, useId, useRef, useState } from "react";
import { useContactForm } from "../../hooks/useContactForm";
import LegalConsent from "../legal/LegalConsent";
import VoiceInput from "../shared/VoiceInput";

interface ServiceOption {
    anchor: string;
    label: string;
    chipLabel: string;
}

interface ContactFormProps {
    title?: string;
    variant?: "full" | "compact" | "quick";
    services?: ServiceOption[];
    source?: string;
    formId?: string;
    homeOriginal?: boolean;
}

const OTHER_SERVICE = "Другая услуга";

function QuickServiceFields({ services }: { services: ServiceOption[] }) {
    const [service, setService] = useState(services[0].label);

    useEffect(() => {
        const selectFromAnchor = (anchor: string | null) => {
            const selected = services.find(option => option.anchor === anchor);
            if (selected) setService(selected.label);
        };
        const selectFromHash = () => selectFromAnchor(window.location.hash);
        // Повторный клик или плавная прокрутка могут не изменить hash.
        const selectFromLink = (event: MouseEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
            const link = event.target instanceof Element && event.target.closest("a");
            if (link) selectFromAnchor(link.getAttribute("href"));
        };
        selectFromHash();
        window.addEventListener("hashchange", selectFromHash);
        document.addEventListener("click", selectFromLink);
        return () => {
            window.removeEventListener("hashchange", selectFromHash);
            document.removeEventListener("click", selectFromLink);
        };
    }, [services]);

    return (
        <>
            <fieldset className="quick-request__services">
                <legend>Какая услуга вас интересует?</legend>
                <div className="quick-request__choices">
                    {[...services, { anchor: "other", label: OTHER_SERVICE, chipLabel: OTHER_SERVICE }].map(option => (
                        <label className="quick-request__choice" key={option.anchor}>
                            <input
                                type="radio"
                                name="service"
                                value={option.label}
                                aria-label={option.chipLabel === option.label ? option.label : `${option.chipLabel} — ${option.label}`}
                                checked={service === option.label}
                                onChange={() => setService(option.label)}
                            />
                            <span>{option.chipLabel}</span>
                        </label>
                    ))}
                </div>
            </fieldset>
        </>
    );
}

export default function ContactForm({
    title = "Оставить заявку",
    variant = "full",
    source = "contact-page",
    formId: assignedFormId,
    homeOriginal = false,
    services,
}: ContactFormProps) {
    const [descriptionPrepared, setDescriptionPrepared] = useState(false);
    const { status, message, handleSubmit } = useContactForm({ source, descriptionPrepared });
    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";
    const compact = variant !== "full";
    const quick = variant === "quick";
    const [ready, setReady] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [voiceBusy, setVoiceBusy] = useState(false);
    const confirmation = useRef<HTMLDivElement>(null);
    const messagePlaceholder = compact
        ? (homeOriginal ? "Например: автоматизировать ответы в поддержке" : "Например, перенести заявки из почты в CRM")
        : "Что нужно изменить в вашем процессе?";
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const formId = useId().replaceAll(":", "");

    useEffect(() => {
        if (quick) setReady(true);
    }, [quick]);

    useEffect(() => {
        if (quick && isSuccess) confirmation.current?.focus({ preventScroll: true });
    }, [quick, isSuccess]);

    // Калькулятор передаёт ответы в query — подставляем их в задачу.
    useEffect(() => {
        const el = messageRef.current;
        if (!el || el.value.trim()) return;
        const params = new URLSearchParams(window.location.search);
        const taskLabels: Record<string, string> = {
            support: "поддержка клиентов",
            sales: "продажи и заявки",
            docs: "документы и база знаний",
            unknown: "задача не определена",
        };
        const scaleLabels: Record<string, string> = {
            small: "до 100 обращений в день",
            medium: "100–1000 обращений в день",
            large: "больше 1000 обращений в день",
        };
        const systemLabels: Record<string, string> = { crm: "CRM", "1c": "1С", messengers: "мессенджеры" };
        const deadlineLabels: Record<string, string> = {
            fast: "2–3 недели",
            normal: "1–2 месяца",
            flexible: "без жёсткого срока",
        };
        const parts: string[] = [];
        const task = params.get("task");
        const scale = params.get("scale");
        const deadline = params.get("deadline");
        const systems = (params.get("systems") || "").split(",").filter(Boolean).map((value) => systemLabels[value]).filter(Boolean);
        if (task && taskLabels[task]) parts.push("Задача: " + taskLabels[task]);
        if (scale && scaleLabels[scale]) parts.push("Объём: " + scaleLabels[scale]);
        if (systems.length) parts.push("Интеграции: " + systems.join(", "));
        if (deadline && deadlineLabels[deadline]) parts.push("Срок: " + deadlineLabels[deadline]);
        if (parts.length) setMessageText(parts.join(". ") + ".");
    }, []);

    const messageId = `${formId}-message`;
    const trimmedMessage = messageText.trim();
    const showMessageHint = !!trimmedMessage && trimmedMessage.split(/\s+/).length <= 3;
    const messageField = (
        <div className={quick ? "quick-request__field" : "form-group col-md-12 mb-5"}>
            <label htmlFor={messageId}>{quick ? "Что хотите обсудить?" : compact ? "Какая задача?" : "Сообщение"}</label>
            <textarea
                name="message"
                className="form-control"
                id={messageId}
                ref={messageRef}
                rows={quick ? 2 : compact ? 3 : 5}
                placeholder={messagePlaceholder}
                value={messageText}
                onChange={(event) => {
                    const value = event.target.value;
                    setMessageText(value);
                    if (!value.trim()) setDescriptionPrepared(false);
                }}
                aria-describedby={showMessageHint ? `${messageId}-hint` : undefined}
            />
            {showMessageHint && <small id={`${messageId}-hint`}>Уточните, какую работу нужно автоматизировать или какой результат вы хотите получить.</small>}
            <VoiceInput targetRef={messageRef} onValueChange={(value, formatted) => {
                setMessageText(value);
                setDescriptionPrepared(formatted);
            }} onBusyChange={setVoiceBusy} disabled={isLoading} />
        </div>
    );

    if (quick && isSuccess) {
        return (
            <div className="quick-request__success" role="status" ref={confirmation} tabIndex={-1}>
                <strong>Заявка отправлена</strong>
                <p>Перезвоним по указанному номеру.</p>
            </div>
        );
    }

    return (
        <div className={quick ? "quick-request__body" : "contact-form"}>
            {variant === "compact" && (homeOriginal || title) && (
                <div className="section-title section-title-center">
                    <h2 className="text-anime-style-3" data-cursor="-opaque">{title}</h2>
                </div>
            )}
            <form
                id={assignedFormId ?? `${formId}-form`}
                method="POST"
                className={quick ? "quick-request__form" : "contact-form wow fadeInUp"}
                data-wow-delay="0.2s"
                onSubmit={voiceBusy ? (event) => event.preventDefault() : handleSubmit}
                onReset={() => {
                    setMessageText("");
                    setDescriptionPrepared(false);
                }}
                noValidate={!quick}
            >
                <div className={quick ? "quick-request__grid" : "row"}>
                    {/* Honeypot: hidden from people, tempting to bots. */}
                    <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                        <label>
                            Max
                            <input type="text" name="max" tabIndex={-1} autoComplete="off" />
                        </label>
                    </div>

                    {quick && services && <QuickServiceFields services={services} />}
                    {quick && messageField}

                    <div className={quick ? "quick-request__contact" : "form-group col-md-6 mb-4"}>
                        <label htmlFor={`${formId}-fname`}>{quick ? "Имя" : "Имя *"}</label>
                        <input type="text" name="fname" className="form-control" id={`${formId}-fname`} placeholder={quick ? "Ваше имя" : "Введите имя *"} autoComplete="given-name" required />
                    </div>

                    {!compact && (
                        <div className="form-group col-md-6 mb-4">
                            <label htmlFor={`${formId}-lname`}>Фамилия</label>
                            <input type="text" name="lname" className="form-control" id={`${formId}-lname`} placeholder="Введите фамилию" autoComplete="family-name" />
                        </div>
                    )}

                    <div className={quick ? "quick-request__contact" : "form-group col-md-6 mb-4"}>
                        <label htmlFor={`${formId}-phone`}>{quick ? "Телефон" : "Номер телефона *"}</label>
                        <input type="tel" name="phone" className="form-control" id={`${formId}-phone`} placeholder={quick ? "+7" : "Введите номер телефона *"} autoComplete="tel" required />
                    </div>

                    {!compact && (
                        <div className="form-group col-md-6 mb-4">
                            <label htmlFor={`${formId}-email`}>Email</label>
                            <input type="email" name="email" className="form-control" id={`${formId}-email`} placeholder="Введите Email" autoComplete="email" />
                        </div>
                    )}

                    {!quick && messageField}

                    <LegalConsent id={`${formId}-legal`} />

                    <div className={quick ? "quick-request__actions" : "col-md-12"}>
                        <button type="submit" className={quick ? "quick-request__submit" : "btn-default"} disabled={isLoading || voiceBusy || (quick && !ready)}>
                            {isLoading ? "Отправка..." : quick ? "Оставить заявку" : "Отправить"}
                            {quick && <span aria-hidden="true"> →</span>}
                        </button>

                        {isSuccess && (
                            <div className="h4 text-success mt-3" role="status">
                                Заявка отправлена. Мы свяжемся с вами.
                            </div>
                        )}

                        {isError && (
                            <div className="help-block with-errors" role="alert">
                                <ul className="list-unstyled">
                                    <li>{message || "Не удалось отправить заявку. Попробуйте ещё раз."}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
