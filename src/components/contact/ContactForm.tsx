import { useEffect, useId, useRef } from "react";
import { useContactForm } from "../../hooks/useContactForm";
import LegalConsent from "../legal/LegalConsent";

interface ContactFormProps {
    title?: string;
    /** "compact" — три поля для главной и CTA-блоков, "full" — форма страницы контактов. */
    variant?: "full" | "compact";
    source?: string;
}

export default function ContactForm({
    title = "Оставить заявку",
    variant = "full",
    source = "contact-page",
}: ContactFormProps) {
    const { status, message, handleSubmit } = useContactForm({ source });
    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";
    const compact = variant === "compact";
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const formId = useId().replaceAll(":", "");

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
        if (parts.length) el.value = parts.join(". ") + ".";
    }, []);

    return (
        <div className="contact-form">
            {compact && (
                <div className="section-title section-title-center">
                    <h2 className="text-anime-style-3" data-cursor="-opaque">{title}</h2>
                </div>
            )}
            <form
                id={`${formId}-form`}
                method="POST"
                className="contact-form wow fadeInUp"
                data-wow-delay="0.2s"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="row">
                    {/* Honeypot: hidden from people, tempting to bots. */}
                    <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                        <label>
                            Max
                            <input type="text" name="max" tabIndex={-1} autoComplete="off" />
                        </label>
                    </div>

                    <div className="form-group col-md-6 mb-4">
                        <label htmlFor={`${formId}-fname`}>Имя *</label>
                        <input type="text" name="fname" className="form-control" id={`${formId}-fname`} placeholder="Введите имя *" autoComplete="given-name" required />
                    </div>

                    {!compact && (
                        <div className="form-group col-md-6 mb-4">
                            <label htmlFor={`${formId}-lname`}>Фамилия</label>
                            <input type="text" name="lname" className="form-control" id={`${formId}-lname`} placeholder="Введите фамилию" autoComplete="family-name" />
                        </div>
                    )}

                    <div className="form-group col-md-6 mb-4">
                        <label htmlFor={`${formId}-phone`}>Номер телефона *</label>
                        <input type="tel" name="phone" className="form-control" id={`${formId}-phone`} placeholder="Введите номер телефона *" autoComplete="tel" required />
                    </div>

                    {!compact && (
                        <div className="form-group col-md-6 mb-4">
                            <label htmlFor={`${formId}-email`}>Email</label>
                            <input type="email" name="email" className="form-control" id={`${formId}-email`} placeholder="Введите Email" autoComplete="email" />
                        </div>
                    )}

                    <div className="form-group col-md-12 mb-5">
                        <label htmlFor={`${formId}-message`}>{compact ? "Какая задача?" : "Сообщение"}</label>
                        <textarea
                            name="message"
                            className="form-control"
                            id={`${formId}-message`}
                            ref={messageRef}
                            rows={compact ? 3 : 5}
                            placeholder={compact ? "Например: автоматизировать ответы в поддержке" : "Ваше сообщение..."}
                        ></textarea>
                    </div>

                    <LegalConsent id={`${formId}-legal`} />

                    <div className="col-md-12">
                        <button type="submit" className="btn-default" disabled={isLoading}>
                            {isLoading ? "Отправка..." : "Отправить"}
                        </button>

                        {isSuccess && (
                            <div className="h4 text-success mt-3" role="status">
                                Сообщение успешно отправлено!
                            </div>
                        )}

                        {isError && (
                            <div className="help-block with-errors" role="alert">
                                <ul className="list-unstyled">
                                    <li>{message || "Что-то пошло не так!"}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
