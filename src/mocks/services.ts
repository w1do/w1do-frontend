export interface Service {
    id: string;
    no: string;
    title: string;
    description: string;
    icon: string;
    tags: string[];
    link: string;
    delay?: string;
}

export const services: Service[] = [
    {
        id: 'mvp',
        no: '01',
        title: 'Сборка прототипов (MVP)',
        description: 'Быстрая проверка гипотез с помощью ИИ. Запуск продукта за 7-14 дней для тестирования рынка с минимальными затратами.',
        icon: '/images/icon-service-1.svg',
        tags: ['MVP', 'Прототипирование'],
        link: '/services',
        delay: '0s'
    },
    {
        id: 'html',
        no: '02',
        title: 'Верстка HTML',
        description: 'Современная, адаптивная верстка с идеальным Pixel Perfect и высокой скоростью загрузки.',
        icon: '/images/icon-service-2.svg',
        tags: ['HTML/CSS', 'Адаптивность'],
        link: '/services',
        delay: '0.2s'
    },
    {
        id: 'ai-bots',
        no: '03',
        title: 'ИИ чат-боты и ассистенты',
        description: 'Конструктор ИИ ассистентов для техподдержки, продаж и HR. Умные помощники на базе разработчик_ии для автоматизации.',
        icon: '/images/icon-service-3.svg',
        tags: ['ИИ Боты', 'Автоматизация'],
        link: '/services',
        delay: '0.4s'
    },
    {
        id: 'refactoring',
        no: '04',
        title: 'Рефакторинг кода',
        description: 'Оптимизация и очистка кода с помощью ИИ-инструментов для повышения производительности и стабильности.',
        icon: '/images/icon-service-1.svg',
        tags: ['Refactoring', 'Optimization'],
        link: '/services',
        delay: '0.6s'
    },
    {
        id: 'mobile',
        no: '05',
        title: 'Создание мобильных приложений',
        description: 'Кроссплатформенная разработка быстрых и интуитивных приложений для вашего бизнеса.',
        icon: '/images/icon-service-2.svg',
        tags: ['Mobile', 'App'],
        link: '/services',
        delay: '0.8s'
    },
    {
        id: 'crm',
        no: '06',
        title: 'Работа с CRM системами',
        description: 'Интеграция AI в AmoCRM, Bitrix24. Автоматическое заполнение сделок и управление процессами.',
        icon: '/images/icon-service-3.svg',
        tags: ['CRM', 'Integration'],
        link: '/services',
        delay: '1.0s'
    },
    {
        id: 'web-dev',
        no: '07',
        title: 'Разработка сайтов',
        description: 'Полноцикловая разработка от дизайна до запуска. Создание эффективных бизнес-инструментов.',
        icon: '/images/icon-service-1.svg',
        tags: ['Web', 'Development'],
        link: '/services',
        delay: '1.2s'
    },
    {
        id: 'web-support',
        no: '08',
        title: 'Доработка сайтов',
        description: 'Расширение функционала существующих проектов, исправление ошибок и поддержка.',
        icon: '/images/icon-service-2.svg',
        tags: ['Support', 'Update'],
        link: '/services',
        delay: '1.4s'
    },
    {
        id: 'payments',
        no: '09',
        title: 'Подключение платежных систем',
        description: 'Интеграция эквайринга, Stripe, крипто-платежей для автоматизации приема оплаты.',
        icon: '/images/icon-service-3.svg',
        tags: ['Payments', 'Checkout'],
        link: '/services',
        delay: '1.6s'
    },
    {
        id: 'ai-avito',
        no: '10',
        title: 'ИИ агенты для Авито',
        description: 'Автоматизация общения и продаж на Авито. Умные боты-автоответчики через официальный API.',
        icon: '/images/icon-service-3.svg',
        tags: ['Авито', 'ИИ Агенты'],
        link: '/services/ai-bot-avito',
        delay: '1.8s'
    }
];
