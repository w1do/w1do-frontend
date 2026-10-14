import { useId, useState } from "react";
import { LEGAL_DOCS } from "../../lib/legal";
import { CHAT_CONSENT_NOTICE } from "../../lib/chat";

interface ChatConsentProps {
    disabled: boolean;
    onAccept: () => void;
}

export default function ChatConsent({ disabled, onAccept }: ChatConsentProps) {
    const [checked, setChecked] = useState(false);
    const id = useId();

    return (
        <div className="ai-chat__consent" role="group" aria-label="Согласие на обработку персональных данных">
            <p>{CHAT_CONSENT_NOTICE}</p>
            <label className="ai-chat__consent-label" htmlFor={id}>
                <input id={id} type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
                <span>Я соглашаюсь с <a href={LEGAL_DOCS.privacyPolicy.href}>политикой обработки персональных данных</a>, <a href={LEGAL_DOCS.personalDataConsent.href}>согласием на обработку данных</a>, <a href={LEGAL_DOCS.userAgreement.href}>условиями использования</a>, <a href={LEGAL_DOCS.publicOffer.href}>публичной офертой</a> и <a href={LEGAL_DOCS.cookies.href}>cookie-файлами</a>.</span>
            </label>
            <button type="button" className="btn-default" disabled={disabled || !checked} onClick={onAccept}>Согласен, продолжить</button>
        </div>
    );
}
