export interface Project {
    id: number;
    title: string;
    category: string;
    categorySlug: string;
    image: string;
    link: string;
    description: string;
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Разработка медицинского центра с оптимизацией по SEO с использованием Claude",
        category: "AI & SEO",
        categorySlug: "seo",
        image: "/images/project-1.jpg",
        link: "/projects",
        description: "Комплексная разработка и продвижение медицинского портала с использованием Claude для генерации контента и SEO оптимизации."
    },
    {
        id: 2,
        title: "Внедрение RAG системы для корпоративной базы знаний на базе OpenAI",
        category: "AI Решения",
        categorySlug: "uiux",
        image: "/images/project-2.jpg",
        link: "/projects",
        description: "Создание интеллектуального ассистента с использованием RAG (Retrieval-Augmented Generation) и OpenAI для быстрого поиска по документам."
    },
    {
        id: 3,
        title: "Автоматизация клиентского сервиса с Antigravity и LLM",
        category: "AI Автоматизация",
        categorySlug: "web",
        image: "/images/project-3.jpg",
        link: "/projects",
        description: "Интеграция Antigravity и современных LLM моделей для автоматической обработки заявок и улучшения клиентского опыта."
    },
    {
        id: 4,
        title: "Система оценки Skills сотрудников на основе нейросетей",
        category: "AI для HR",
        categorySlug: "uiux",
        image: "/images/project-4.jpg",
        link: "/projects",
        description: "Платформа для анализа навыков (Skills) персонала с использованием больших языковых моделей и предиктивной аналитики."
    },
    {
        id: 5,
        title: "SEO-платформа нового поколения с интеграцией Claude и OpenAI",
        category: "SEO & Content",
        categorySlug: "seo",
        image: "/images/project-5.jpg",
        link: "/projects",
        description: "Разработка инструмента для автоматизации SEO-задач, использующего синергию Claude и OpenAI для создания высококачественного контента."
    },
    {
        id: 6,
        title: "Интеграция LLM в бизнес-процессы производства",
        category: "AI Решения",
        categorySlug: "web",
        image: "/images/project-6.jpg",
        link: "/projects",
        description: "Внедрение LLM моделей для оптимизации производственных цепочек и управления логистикой."
    }
];
