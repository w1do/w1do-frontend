import { LEGAL_CONSENT_VALUE, LEGAL_DOCS } from "../../lib/legal";

interface LegalConsentProps {
    id: string;
}

export default function LegalConsent({ id }: LegalConsentProps) {
    return (
        <div className="form-group col-md-12 mb-4">
            <div className="form-check legal-consent">
                <input
                    className="form-check-input"
                    id={id}
                    name="legalConsent"
                    type="checkbox"
                    value={LEGAL_CONSENT_VALUE}
                    required
                />
                <label className="form-check-label" htmlFor={id}>
                    Я соглашаюсь с{" "}
                    <a href={LEGAL_DOCS.privacyPolicy.href}>политикой обработки персональных данных</a>,{" "}
                    <a href={LEGAL_DOCS.personalDataConsent.href}>согласием на обработку данных</a>,{" "}
                    <a href={LEGAL_DOCS.userAgreement.href}>условиями использования</a>,{" "}
                    <a href={LEGAL_DOCS.publicOffer.href}>публичной офертой</a> и{" "}
                    <a href={LEGAL_DOCS.cookies.href}>cookie-файлами</a>.
                </label>
            </div>
        </div>
    );
}
