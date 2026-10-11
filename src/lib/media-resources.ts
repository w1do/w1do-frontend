export interface MediaResource {
    icon: string;
    title: string;
    description: string;
    label: string;
    href: string;
}

export const MEDIA_SECTION = {
    subTitle: "Медиа и сообщество",
    title: "Где я показываю разработку ИИ изнутри",
    description:
        "В коммерческих проектах заказчик видит готовый результат. Здесь я выкладываю то, что обычно остаётся за кадром: как собираю агентов, где они ломаются и какие инструменты в итоге оставляю в работе.",
    counterValue: "3",
    counterDesc: "Три площадки: видео, чат, где можно задать вопрос, и личка для разговора о проекте.",
} as const;

export const MEDIA_RESOURCES: readonly MediaResource[] = [
    {
        icon: "/images/media/icon-youtube.svg",
        title: "YouTube @w1do_digital",
        description:
            "Записи экрана без монтажных чудес: подключаю LLM к живым сервисам, собираю агентов в Cursor и Claude Code и показываю, на каком шаге всё пошло не так и как я это починил.",
        label: "Видео",
        href: "https://www.youtube.com/@w1do_digital",
    },
    {
        icon: "/images/media/icon-telegram-channel.svg",
        title: "Telegram @W1DO_DIGITAL",
        description:
            "Напишите напрямую, если хотите обсудить проект или задать вопрос по разработке. Ответ придёт в Telegram.",
        label: "Личка",
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
