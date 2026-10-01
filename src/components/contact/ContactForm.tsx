import { useContactForm } from "../../hooks/useContactForm";
import LegalConsent from "../legal/LegalConsent";

interface ContactFormProps {
    title?: string;
}

export default function ContactForm({
    title = "Оставить заявку",
}: ContactFormProps) {
    const { status, message, handleSubmit } = useContactForm({ source: "contact-page" });
    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";

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
                        <label>Имя *</label>
                        <input type="text" name="fname" className="form-control" id="fname" placeholder="Введите имя *" required />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                        <label>Фамилия</label>
                        <input type="text" name="lname" className="form-control" id="lname" placeholder="Введите фамилию" />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                        <label>Номер телефона *</label>
                        <input type="text" name="phone" className="form-control" id="phone" placeholder="Введите номер телефона *" required />
                    </div>

                    <div className="form-group col-md-6 mb-4">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" id="email" placeholder="Введите Email" />
                    </div>

                    <div className="form-group col-md-12 mb-5">
                        <label>Сообщение</label>
                        <textarea name="message" className="form-control" id="message" rows={5} placeholder="Ваше сообщение..."></textarea>
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
