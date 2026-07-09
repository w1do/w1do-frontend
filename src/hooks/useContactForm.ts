import { useState, type FormEvent } from "react";

export interface UseContactFormOptions {
    endpoint?: string;
    project?: string;
}

export type FormStatus = "idle" | "loading" | "success" | "error";

const DEFAULT_ENDPOINT = "https://n8n.w1do.ru/webhook/requests";
const DEFAULT_PROJECT = "chistotyumen";

export function useContactForm({
    endpoint = DEFAULT_ENDPOINT,
    project = DEFAULT_PROJECT,
}: UseContactFormOptions = {}) {
    const [status, setStatus] = useState<FormStatus>("idle");
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formEl = event.currentTarget;
        const data = new FormData(formEl);
        const fname = (data.get("fname") as string | null)?.trim() || "";
        const lname = (data.get("lname") as string | null)?.trim() || "";
        const phone = (data.get("phone") as string | null)?.trim() || "";
        const email = (data.get("email") as string | null)?.trim() || "";
        const messageText = (data.get("message") as string | null)?.trim() || "";
        const name = `${fname} ${lname}`.trim();

        if (!fname || !phone) {
            setStatus("error");
            setMessage("Укажите имя и телефон.");
            return;
        }

        const payload = {
            email: email || "не указан",
            subject: `Заявка с сайта${name ? `: ${name}` : ""}`,
            phone,
            message: messageText || `Имя: ${name}`,
            project,
        };

        setStatus("loading");
        setMessage("");

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            setStatus("success");
            setMessage("Заявка отправлена!");
            formEl.reset();
        } catch (error) {
            setStatus("error");
            setMessage("Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.");
        }
    };

    return { status, message, handleSubmit };
}
