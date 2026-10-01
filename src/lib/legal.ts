export const LEGAL_DOCS = {
    privacyPolicy: {
        label: "Политика обработки персональных данных",
        href: "/docs/privacy-policy",
    },
    personalDataConsent: {
        label: "Согласие на обработку персональных данных",
        href: "/docs/personal-data-consent",
    },
    publicOffer: {
        label: "Публичная оферта",
        href: "/docs/public-offer",
    },
    userAgreement: {
        label: "Условия использования",
        href: "/docs/user-agreement",
    },
    cookies: {
        label: "Cookie-файлы",
        href: "/docs/cookies",
    },
} as const;

export const FOOTER_LEGAL_LINKS = Object.values(LEGAL_DOCS);
export const LEGAL_CONSENT_VALUE = "accepted";
