import { useContactForm } from "../../hooks/useContactForm";

interface ContactFormProps {
    title?: string;
    endpoint?: string;
    project?: string;
}

export default function ContactForm({
    title = "Оставить заявку",
    endpoint = "https://n8n.w1do.ru/webhook/requests",
    project = "w1do",
}: ContactFormProps) {
    const { status, message, handleSubmit } = useContactForm({ endpoint, project });
    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";

    return (
        <div className="contact-form">
            <form
                id="contactForm"
                method="POST"
                className="contact-form wow fadeInUp"
                data-wow-delay="0.2s"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="row">
                    <div className="form-group col-md-6 mb-4">
                        <label>Имя *</label>
                        <input type="text" name="fname" className="form-control" id="fname" placeholder="Введите имя *" required />
                        <div className="help-block with-errors"></div>
                    </div>

                    <div className="form-group col-md-6 mb-4">
                        <label>Фамилия *</label>
                        <input type="text" name="lname" className="form-control" id="lname" placeholder="Введите фамилию *" required />
                        <div className="help-block with-errors"></div>
                    </div>

                    <div className="form-group col-md-6 mb-4">
                        <label>Номер телефона *</label>
                        <input type="text" name="phone" className="form-control" id="phone" placeholder="Введите номер телефона *" required />
                        <div className="help-block with-errors"></div>
                    </div>

                    <div className="form-group col-md-6 mb-4">
                        <label>Email *</label>
                        <input type="email" name="email" className="form-control" id="email" placeholder="Введите Email *" required />
                        <div className="help-block with-errors"></div>
                    </div>

                    <div className="form-group col-md-12 mb-5">
                        <label>Сообщение *</label>
                        <textarea name="message" className="form-control" id="message" rows={5} placeholder="Ваше сообщение..."></textarea>
                        <div className="help-block with-errors"></div>
                    </div>

                    <div className="col-md-12">
                        <button type="submit" className="btn-default" disabled={isLoading}>
                            {isLoading ? "Отправка..." : "Отправить"}
                        </button>

                        {isSuccess && (
                            <div id="msgSubmit" className="h4 text-success mt-3">
                                Сообщение успешно отправлено!
                            </div>
                        )}

                        {isError && (
                            <div className="help-block with-errors">
                                <ul className="list-unstyled">
                                    <li>{message || "Что-то пошло не так!"}</li>
                                </ul>
                            </div>
                        )}
                        <div id="msgSubmit" className="h4 hidden"></div>
                    </div>
                </div>
            </form>
        </div>
    );
}
