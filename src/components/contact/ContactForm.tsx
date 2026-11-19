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

    return (
        <div className="contact-form">
            <form
                id="leadForm"
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
                        <label htmlFor="fname">Имя *</label>
                        <input type="text" name="fname" className="form-control" id="fname" placeholder="Введите имя *" autoComplete="given-name" required />
                    </div>

                    {!compact && (
                        <div className="form-group col-md-6 mb-4">
                            <label htmlFor="lname">Фамилия</label>
                            <input type="text" name="lname" className="form-control" id="lname" placeholder="Введите фамилию" autoComplete="family-name" />
                        </div>
                    )}

                    <div className="form-group col-md-6 mb-4">
                        <label htmlFor="phone">Номер телефона *</label>
                        <input type="tel" name="phone" className="form-control" id="phone" placeholder="Введите номер телефона *" autoComplete="tel" required />
                    </div>

                    {!compact && (
                        <div className="form-group col-md-6 mb-4">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" className="form-control" id="email" placeholder="Введите Email" autoComplete="email" />
                        </div>
                    )}

                    <div className="form-group col-md-12 mb-5">
                        <label htmlFor="message">{compact ? "Какая задача?" : "Сообщение"}</label>
                        <textarea
                            name="message"
                            className="form-control"
                            id="message"
                            rows={compact ? 3 : 5}
                            placeholder={compact ? "Например: автоматизировать ответы в поддержке" : "Ваше сообщение..."}
                        ></textarea>
                    </div>

                    <LegalConsent id="leadFormLegalConsent" />

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
