import { useContactForm } from "../../hooks/useContactForm";
import LegalConsent from "../legal/LegalConsent";

interface CtaFormProps {
    title?: string;
}

export default function CtaForm({
    title = "Связаться со мной",
}: CtaFormProps) {
    const { status, message, handleSubmit } = useContactForm({ source: "cta-block" });
    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";

    return (
        <div className="cta-form-box box-border-gradiant">
            {/* Section Title Start */}
            <div className="section-title section-title-center">
                <h2 className="text-anime-style-3" data-cursor="-opaque">{title}</h2>
            </div>
            {/* Section Title End */}

            {/* Cta Form Start */}
            <div className="contact-form">
                <form
                    id="ctaLeadForm"
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
                            <input
                                type="text"
                                name="fname"
                                className="form-control"
                                placeholder="Введите имя *"
                                required
                            />
                        </div>

                        <div className="form-group col-md-6 mb-4">
                            <label>Фамилия</label>
                            <input
                                type="text"
                                name="lname"
                                className="form-control"
                                placeholder="Введите фамилию"
                            />
                        </div>

                        <div className="form-group col-md-6 mb-4">
                            <label>Номер телефона *</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                placeholder="Введите номер телефона *"
                                required
                            />
                        </div>

                        <div className="form-group col-md-6 mb-4">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Введите Email"
                            />
                        </div>

                        <div className="form-group col-md-12 mb-5">
                            <label>Сообщение</label>
                            <textarea
                                name="message"
                                className="form-control"
                                rows={5}
                                placeholder="Ваше сообщение..."
                            ></textarea>
                        </div>

                        <LegalConsent id="ctaLeadFormLegalConsent" />

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
            {/* Cta Form End */}
        </div>
    );
}
