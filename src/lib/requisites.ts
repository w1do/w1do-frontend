// Реквизиты исполнителя из юридических документов W1DO (docs/legal-documents.md).
export const REQUISITES = {
    legalName: "Митрофанова Галина Сергеевна",
    status: "самозанятая (НПД)",
    inn: "561019248440",
    email: "info@w1do.ru",
} as const;

export const REQUISITES_TEXT = `Исполнитель: ${REQUISITES.legalName}, ${REQUISITES.status}, ИНН ${REQUISITES.inn}`;
