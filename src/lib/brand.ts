// Единая очистка старых брендовых подстановок из CMS.
const LEGACY_PLACEHOLDER = ["разработчик", "ии"].join("_");

export function brandName(value: string): string {
    return value
        .replace(/W1DO DIGITAL/g, "AiCRAFT.AGENCY")
        .replace(/W1DO/g, "AiCRAFT")
        .replaceAll(LEGACY_PLACEHOLDER, "разработчик ИИ");
}
