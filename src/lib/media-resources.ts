export interface MediaResource {
    icon: string;
    title: string;
    description: string;
    label: string;
    href: string;
}

export const MEDIA_SECTION = {
    subTitle: "Медиа и сообщество",
    title: "Как команда AiCRAFT разрабатывает ИИ-агентов",
    description:
        "Делимся тем, что обычно остаётся за кадром проекта. Показываем, как собираем агентов, находим причины сбоев и выбираем инструменты для работы.",
    counterValue: "3",
    counterDesc: "Смотрите разборы на YouTube, задавайте вопросы в чате или обсудите проект с нашей командой в Telegram.",
} as const;

export const MEDIA_RESOURCES: readonly MediaResource[] = [
    {
        icon: "/images/media/icon-youtube.svg",
        title: "YouTube-канал",
        description:
            "Записываем экран во время разработки. Подключаем языковые модели к сервисам, собираем агентов в Cursor и Claude Code, разбираем ошибки и показываем исправления.",
        label: "Видео",
        href: "https://www.youtube.com/@w1do_digital",
    },
    {
        icon: "/images/media/icon-telegram-channel.svg",
        title: "Telegram",
        description:
            "Напишите команде AiCRAFT в Telegram. Обсудим вашу задачу и ответим на вопросы о разработке.",
        label: "Связь",
        href: "https://t.me/W1DO_DIGITAL",
    },
    {
        icon: "/images/media/icon-telegram-chat.svg",
        title: "IT-ИИшница в Telegram",
        description:
            "Чат для тех, кто уже внедряет ИИ или только примеряется. Спросите про RAG, выбор модели или стоимость токенов, и ответят люди, которые решали ту же задачу у себя.",
        label: "Чат",
        href: "https://t.me/vibe_ai_club",
    },
];
