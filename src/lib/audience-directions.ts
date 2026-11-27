export interface AudienceLink {
    title: string;
    href: string;
}

export interface AudienceScene {
    title: string;
    input: string;
    output: string;
}

export interface Audience {
    slug: string;
    label: string;
    groupId: string;
    groupLabel: string;
    pain: string;
    workflow: string[];
    outcome: string;
    example: string;
    scene: AudienceScene;
    alt: string;
    icon: string;
    illustration: string;
    links: AudienceLink[];
}

export interface AudienceGroup {
    id: string;
    label: string;
    count: number;
}

export const AUDIENCE_SECTION = {
    "eyebrow": "Кому подходят наши услуги",
    "heading": "ИИ-агенты для вашей сферы",
    "intro": "Найдите своё направление и посмотрите, какие задачи можно передать ИИ: от первых обращений до документов, аналитики и внутренних процессов.",
    "disclaimer": "Число обозначает предложенные направления применения; оно не является числом реализованных кейсов или готовых внедрений.",
    "seoParagraphs": [
        "ИИ-агент полезен там, где команда регулярно обрабатывает сообщения, документы, заявки и данные. Для юридической практики это поиск по материалам и сравнение договоров, для маркетинга — подготовка контента и разбор отчётов, для продаж — обработка обращений и работа с CRM. В производстве, строительстве, образовании и сервисном бизнесе можно начать с одного повторяющегося процесса, у которого понятны входные данные и ожидаемый результат.",
        "AICraft Agency проектирует автоматизацию под рабочий процесс компании. Подключаем агента к базе знаний, каталогу, внутренним документам и используемым системам. Он помогает найти нужную информацию, собрать данные клиента, подготовить документ, обновить статус заявки или передать задачу ответственному сотруднику. Для решений, требующих профессиональной оценки, предусматриваем проверку и согласование человеком.",
        "В подборке представлены 120 направлений для внедрения. Откройте свою сферу: в карточке показаны типичная задача, сценарий работы агента и связанные услуги — разработка ИИ-агентов, чат-ботов, баз знаний RAG, автоматизация CRM и обработка документов. Если работа связана с внутренними данными, отдельно рассматриваем развёртывание локальных моделей. Начинаем с конкретной задачи и измеряем результат по согласованным показателям: времени обработки, числу ручных действий и качеству подготовленных материалов."
    ]
} as const;

export const AUDIENCE_GROUPS: AudienceGroup[] = [
    {
        "id": "management",
        "label": "Управление и команды",
        "count": 10
    },
    {
        "id": "legal-finance",
        "label": "Право, учёт и финансовые услуги",
        "count": 10
    },
    {
        "id": "marketing",
        "label": "Маркетинг и креатив",
        "count": 10
    },
    {
        "id": "commerce",
        "label": "Торговля и продажи",
        "count": 10
    },
    {
        "id": "construction-property",
        "label": "Недвижимость и строительство",
        "count": 10
    },
    {
        "id": "industry-logistics",
        "label": "Производство и логистика",
        "count": 10
    },
    {
        "id": "automotive-transport",
        "label": "Автобизнес и транспорт",
        "count": 10
    },
    {
        "id": "health-beauty",
        "label": "Здоровье, красота и фитнес",
        "count": 10
    },
    {
        "id": "education-media",
        "label": "Образование и медиа",
        "count": 10
    },
    {
        "id": "hospitality-tourism",
        "label": "Гостеприимство и туризм",
        "count": 10
    },
    {
        "id": "it-b2b",
        "label": "IT и профессиональные услуги",
        "count": 10
    },
    {
        "id": "local-community",
        "label": "Локальные услуги и другие отрасли",
        "count": 10
    }
];

export const AUDIENCES: Audience[] = [
    {
        "slug": "business-owners",
        "label": "Владельцам бизнеса",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Руководитель собирает картину бизнеса вручную из разных систем и переписок.",
        "workflow": [
            "Получает выбранные показатели из подключённых систем",
            "Собирает сводку с подтверждающими записями",
            "Выделяет вопросы, требующие решения руководителя"
        ],
        "outcome": "Управленческая сводка с источниками и понятным списком действий.",
        "example": "Собирает недельную сводку из CRM, задач и обращений: что задерживается, где требуется решение руководителя и на какие исходные записи опирается вывод.",
        "scene": {
            "title": "Обзор бизнеса",
            "input": "CRM и задачи",
            "output": "Сводка руководителю"
        },
        "alt": "ИИ-агент для направления «Владельцам бизнеса»: обзор бизнеса",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/business-owners.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/business-owners.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "branch-managers",
        "label": "Управляющим филиалами",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Отчёты филиалов приходят в разном формате и плохо сопоставляются.",
        "workflow": [
            "Принимает отчёты по подразделениям",
            "Приводит показатели к согласованному формату",
            "Выделяет отклонения и вопросы для уточнения"
        ],
        "outcome": "Сопоставимые данные филиалов и очередь вопросов для проверки.",
        "example": "Сводит отчёты филиалов в общий формат, отмечает отклонения от внутренних планов и готовит список вопросов для управляющих.",
        "scene": {
            "title": "Филиалы рядом",
            "input": "Отчёты филиалов",
            "output": "Общая картина"
        },
        "alt": "ИИ-агент для направления «Управляющим филиалами»: филиалы рядом",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/branch-managers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/branch-managers.svg",
        "links": [
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "project-teams",
        "label": "Проектным командам",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Договорённости встреч остаются в записях, а задачи теряют ответственных.",
        "workflow": [
            "Разбирает запись встречи и обсуждения",
            "Выделяет решения, сроки и ответственных",
            "Готовит задачи и напоминания на подтверждение"
        ],
        "outcome": "Согласованный список действий после встречи без ручного пересказа.",
        "example": "После встречи выделяет решения, сроки и ответственных, предлагает задачи в трекере и напоминает о согласованных действиях.",
        "scene": {
            "title": "Решения встречи",
            "input": "Запись встречи",
            "output": "Задачи и сроки"
        },
        "alt": "ИИ-агент для направления «Проектным командам»: решения встречи",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/project-teams.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/project-teams.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "operations-directors",
        "label": "Операционным директорам",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Зависшие операции обнаруживаются после жалобы или срыва внутреннего срока.",
        "workflow": [
            "Читает статусы заданных процессов",
            "Сопоставляет их с контрольными сроками",
            "Формирует очередь исключений для ответственных"
        ],
        "outcome": "Обзор незавершённых операций с понятным следующим действием.",
        "example": "Сопоставляет заявки, регламенты и статусы процессов, формирует очередь зависших операций и направляет их ответственным.",
        "scene": {
            "title": "Контроль процессов",
            "input": "Статусы операций",
            "output": "Очередь действий"
        },
        "alt": "ИИ-агент для направления «Операционным директорам»: контроль процессов",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/operations-directors.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/operations-directors.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            }
        ]
    },
    {
        "slug": "hr-teams",
        "label": "HR-отделам",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "HR регулярно отвечает на одинаковые вопросы о правилах и документах.",
        "workflow": [
            "Уточняет вопрос сотрудника",
            "Находит ответ в утверждённой базе",
            "Передаёт нестандартный запрос кадровому специалисту"
        ],
        "outcome": "Самообслуживание по типовым вопросам и подготовленные обращения к HR.",
        "example": "Отвечает сотрудникам по утверждённой базе кадровых правил, собирает заявки на отпуск и передаёт нестандартные вопросы HR.",
        "scene": {
            "title": "Ответ сотруднику",
            "input": "Вопрос сотрудника",
            "output": "Ответ по правилам"
        },
        "alt": "ИИ-агент для направления «HR-отделам»: ответ сотруднику",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/hr-teams.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/hr-teams.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "recruiters",
        "label": "Рекрутерам",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Резюме и переписки приходится вручную сводить перед каждым интервью.",
        "workflow": [
            "Извлекает профессиональный опыт по заданной схеме",
            "Готовит вопросы для уточнения опыта",
            "Предлагает доступные интервалы интервью"
        ],
        "outcome": "Структурированная подготовка к интервью с сохранением решения за рекрутером.",
        "example": "Структурирует резюме по заданным профессиональным требованиям, готовит вопросы к интервью и согласует доступные интервалы встреч.",
        "scene": {
            "title": "Подготовка интервью",
            "input": "Резюме кандидата",
            "output": "Вопросы к интервью"
        },
        "alt": "ИИ-агент для направления «Рекрутерам»: подготовка интервью",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/recruiters.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/recruiters.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "office-managers",
        "label": "Офис-менеджерам",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Внутренние заявки теряются между личными сообщениями и общими чатами.",
        "workflow": [
            "Принимает и классифицирует запрос",
            "Уточняет адрес, срок и необходимые детали",
            "Создаёт заявку нужному исполнителю"
        ],
        "outcome": "Единая очередь офисных обращений с полными исходными данными.",
        "example": "Принимает внутренние запросы на пропуска, канцелярию и ремонт, проверяет комплектность данных и создаёт заявки ответственным.",
        "scene": {
            "title": "Офисная заявка",
            "input": "Запрос из офиса",
            "output": "Заявка исполнителю"
        },
        "alt": "ИИ-агент для направления «Офис-менеджерам»: офисная заявка",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/office-managers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/office-managers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "corporate-training",
        "label": "Корпоративному обучению",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Сотрудники ищут материалы сами, а наставнику трудно увидеть пробелы.",
        "workflow": [
            "Определяет тему и роль сотрудника",
            "Подбирает материалы из внутренней базы",
            "Готовит вопросы и сводку для наставника"
        ],
        "outcome": "Персональный маршрут по корпоративным материалам и темы для разбора.",
        "example": "Подбирает сотруднику материалы по его роли, составляет вопросы по базе знаний и показывает наставнику темы, требующие разбора.",
        "scene": {
            "title": "Маршрут обучения",
            "input": "Роль и материалы",
            "output": "План обучения"
        },
        "alt": "ИИ-агент для направления «Корпоративному обучению»: маршрут обучения",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/corporate-training.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/corporate-training.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "compliance-teams",
        "label": "Комплаенс-командам",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Проверка типовых документов по внутренним политикам занимает много ручного внимания.",
        "workflow": [
            "Принимает документы и утверждённые требования",
            "Отмечает отсутствующие поля и спорные фрагменты",
            "Собирает список замечаний для специалиста"
        ],
        "outcome": "Предварительная проверка с привязкой замечаний к исходным фрагментам.",
        "example": "Ищет в документах обязательные поля и несоответствия утверждённым внутренним политикам, выделяет фрагменты для проверки сотрудником.",
        "scene": {
            "title": "Проверка политики",
            "input": "Документы и правила",
            "output": "Список замечаний"
        },
        "alt": "ИИ-агент для направления «Комплаенс-командам»: проверка политики",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/compliance-teams.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/compliance-teams.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "finance-directors",
        "label": "Финансовым директорам",
        "groupId": "management",
        "groupLabel": "Управление и команды",
        "pain": "Комментарии к управленческой отчётности приходится собирать из нескольких таблиц.",
        "workflow": [
            "Читает выбранные отчёты и справочники",
            "Сопоставляет периоды по заданным правилам",
            "Готовит комментарий с указанием исходных строк"
        ],
        "outcome": "Черновик аналитической записки, который можно проверить по данным.",
        "example": "Сводит управленческие таблицы, поясняет расхождения со ссылками на исходные строки и готовит черновик комментария к отчёту.",
        "scene": {
            "title": "Финансовая сводка",
            "input": "Управленческие отчёты",
            "output": "Комментарий к данным"
        },
        "alt": "ИИ-агент для направления «Финансовым директорам»: финансовая сводка",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/finance-directors.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/finance-directors.svg",
        "links": [
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "lawyers",
        "label": "Юристам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "На сравнение договоров и поиск отклонений уходит время квалифицированного юриста.",
        "workflow": [
            "Принимает договор и согласованный шаблон",
            "Выделяет различия со ссылками на пункты",
            "Готовит таблицу замечаний для проверки юристом"
        ],
        "outcome": "Проверяемый черновик разбора договора и список вопросов контрагенту.",
        "example": "Сравнивает версии договоров, находит отклонения от согласованного шаблона и готовит таблицу замечаний со ссылками на пункты для проверки юристом.",
        "scene": {
            "title": "Сравнение договоров",
            "input": "Договор и шаблон",
            "output": "Таблица замечаний"
        },
        "alt": "ИИ-агент для направления «Юристам»: сравнение договоров",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/lawyers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/lawyers.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "advocates",
        "label": "Адвокатам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Объёмные материалы дела сложно быстро собрать в единую хронологию.",
        "workflow": [
            "Разбирает загруженные документы дела",
            "Выстраивает события с датами и источниками",
            "Показывает пробелы и спорные связи"
        ],
        "outcome": "Хронология с подтверждающими документами для дальнейшей работы адвоката.",
        "example": "Собирает хронологию дела из загруженных материалов и находит документы, подтверждающие каждый эпизод, для дальнейшей работы адвоката.",
        "scene": {
            "title": "Хронология дела",
            "input": "Материалы дела",
            "output": "События с источниками"
        },
        "alt": "ИИ-агент для направления «Адвокатам»: хронология дела",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/advocates.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/advocates.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "notary-offices",
        "label": "Нотариальным конторам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Посетители приходят без нужных сведений и повторно уточняют порядок обращения.",
        "workflow": [
            "Уточняет вид обращения",
            "Выдаёт утверждённый список документов",
            "Передаёт сотруднику собранные сведения"
        ],
        "outcome": "Подготовленная первичная заявка и понятный посетителю порядок действий.",
        "example": "Принимает первичные обращения, выдаёт утверждённый перечень необходимых документов и передаёт подготовленную заявку сотруднику.",
        "scene": {
            "title": "Комплект документов",
            "input": "Первичное обращение",
            "output": "Список для приёма"
        },
        "alt": "ИИ-агент для направления «Нотариальным конторам»: комплект документов",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/notary-offices.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/notary-offices.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "accounting-firms",
        "label": "Бухгалтерским фирмам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Первичка поступает в разных форматах, с пропусками и повторными файлами.",
        "workflow": [
            "Извлекает реквизиты документов",
            "Сопоставляет их с заданными проверками",
            "Формирует пакет исключений бухгалтеру"
        ],
        "outcome": "Структурированная первичка и перечень документов, требующих проверки.",
        "example": "Извлекает реквизиты из первичных документов, отмечает пропуски и дубли и формирует пакет на проверку бухгалтеру.",
        "scene": {
            "title": "Разбор первички",
            "input": "Счета и акты",
            "output": "Пакет на проверку"
        },
        "alt": "ИИ-агент для направления «Бухгалтерским фирмам»: разбор первички",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/accounting-firms.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/accounting-firms.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            }
        ]
    },
    {
        "slug": "auditors",
        "label": "Аудиторам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Подтверждающие документы приходится вручную сопоставлять с реестром операций.",
        "workflow": [
            "Принимает реестр и комплект документов",
            "Связывает записи по реквизитам",
            "Выделяет отсутствие подтверждений и расхождения"
        ],
        "outcome": "Подготовленная выборка исключений с переходом к исходным документам.",
        "example": "Сопоставляет реестр операций с подтверждающими документами и составляет перечень расхождений для аудиторской проверки.",
        "scene": {
            "title": "Сверка операций",
            "input": "Реестр и документы",
            "output": "Список расхождений"
        },
        "alt": "ИИ-агент для направления «Аудиторам»: сверка операций",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/auditors.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/auditors.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "tax-consultants",
        "label": "Налоговым консультантам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Перед ответом клиенту приходится искать материалы в разных внутренних источниках.",
        "workflow": [
            "Уточняет вопрос и период",
            "Находит материалы в согласованной базе",
            "Собирает черновик с цитируемыми источниками"
        ],
        "outcome": "Исходный материал для проверки и ответа налогового консультанта.",
        "example": "Находит в корпоративной базе релевантные разъяснения и исходные данные клиента, собирает черновик ответа с источниками для проверки консультантом.",
        "scene": {
            "title": "Поиск разъяснений",
            "input": "Вопрос и база",
            "output": "Черновик с источниками"
        },
        "alt": "ИИ-агент для направления «Налоговым консультантам»: поиск разъяснений",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/tax-consultants.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/tax-consultants.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "insurance-brokers",
        "label": "Страховым брокерам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Условия предложений сложно сравнивать, когда форматы документов различаются.",
        "workflow": [
            "Уточняет требуемые параметры сравнения",
            "Извлекает условия из предоставленных предложений",
            "Готовит таблицу и вопросы брокеру"
        ],
        "outcome": "Прозрачное сравнение полученных предложений без потери важных условий.",
        "example": "Собирает параметры запроса, сопоставляет предложения по указанным условиям и готовит клиенту сравнительную таблицу для согласования брокером.",
        "scene": {
            "title": "Сравнение полисов",
            "input": "Страховые предложения",
            "output": "Таблица условий"
        },
        "alt": "ИИ-агент для направления «Страховым брокерам»: сравнение полисов",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/insurance-brokers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/insurance-brokers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "leasing-companies",
        "label": "Лизинговым компаниям",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Заявки задерживаются из-за недостающих документов и повторных уточнений.",
        "workflow": [
            "Принимает данные клиента",
            "Проверяет комплектность по внутреннему списку",
            "Запрашивает недостающее и обновляет карточку"
        ],
        "outcome": "Комплектная заявка, готовая к рассмотрению сотрудником.",
        "example": "Проверяет наличие документов в заявке, запрашивает недостающие сведения и передаёт полный комплект менеджеру.",
        "scene": {
            "title": "Лизинговая заявка",
            "input": "Данные и документы",
            "output": "Комплектная заявка"
        },
        "alt": "ИИ-агент для направления «Лизинговым компаниям»: лизинговая заявка",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/leasing-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/leasing-companies.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "credit-brokers",
        "label": "Кредитным брокерам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Менеджер тратит время на перенос данных и поиск пробелов в заявке.",
        "workflow": [
            "Структурирует сведения клиента",
            "Проверяет заполнение обязательных полей",
            "Передаёт менеджеру карточку и список уточнений"
        ],
        "outcome": "Собранные исходные данные для дальнейшей работы брокера.",
        "example": "Структурирует данные заявки и документы клиента, показывает недостающие поля и обновляет статус обращения в CRM.",
        "scene": {
            "title": "Анкета заёмщика",
            "input": "Анкета и файлы",
            "output": "Данные для менеджера"
        },
        "alt": "ИИ-агент для направления «Кредитным брокерам»: анкета заёмщика",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/credit-brokers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/credit-brokers.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            }
        ]
    },
    {
        "slug": "financial-consultants",
        "label": "Финансовым консультантам",
        "groupId": "legal-finance",
        "groupLabel": "Право, учёт и финансовые услуги",
        "pain": "Первую консультацию занимает сбор разрозненной информации о целях и обязательствах.",
        "workflow": [
            "Принимает согласованную анкету и документы",
            "Сводит цели, сроки и обязательства",
            "Готовит повестку консультации"
        ],
        "outcome": "Подготовленная встреча с вопросами, основанными на данных клиента.",
        "example": "Готовит встречу по согласованной анкете и документам клиента: сводит цели, обязательства и вопросы, требующие обсуждения.",
        "scene": {
            "title": "План консультации",
            "input": "Цели и обязательства",
            "output": "Повестка встречи"
        },
        "alt": "ИИ-агент для направления «Финансовым консультантам»: план консультации",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/financial-consultants.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/financial-consultants.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "marketers",
        "label": "Маркетологам",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Данные рекламы и CRM расходятся, а отчёт приходится собирать вручную.",
        "workflow": [
            "Сводит разрешённые выгрузки по правилам атрибуции",
            "Показывает расхождения и недостающие данные",
            "Готовит гипотезы для проверки маркетологом"
        ],
        "outcome": "Единый черновик отчёта с обозначенными ограничениями данных.",
        "example": "Сводит данные рекламных кабинетов и CRM, выявляет расхождения в отчётности и готовит гипотезы для проверки командой.",
        "scene": {
            "title": "Рекламная аналитика",
            "input": "Кабинеты и CRM",
            "output": "Гипотезы для проверки"
        },
        "alt": "ИИ-агент для направления «Маркетологам»: рекламная аналитика",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/marketers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/marketers.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "seo-agencies",
        "label": "SEO-студиям",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Большие выгрузки запросов трудно быстро разнести по страницам и задачам.",
        "workflow": [
            "Принимает семантику и карту сайта",
            "Группирует запросы по намерению пользователя",
            "Готовит структуру страниц и черновики заданий"
        ],
        "outcome": "Основа для SEO-плана, которую специалист проверяет перед внедрением.",
        "example": "Группирует выгруженные поисковые запросы по намерению, сопоставляет их со страницами сайта и готовит черновики технических заданий.",
        "scene": {
            "title": "Карта семантики",
            "input": "Запросы и страницы",
            "output": "Кластеры и задания"
        },
        "alt": "ИИ-агент для направления «SEO-студиям»: карта семантики",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/seo-agencies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/seo-agencies.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "advertising-agencies",
        "label": "Рекламным агентствам",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Брифы неполные, а варианты сообщений приходится сверять с множеством ограничений.",
        "workflow": [
            "Структурирует бриф и ограничения бренда",
            "Готовит варианты сообщений под формат",
            "Проверяет обязательные элементы перед согласованием"
        ],
        "outcome": "Пакет рекламных черновиков и список вопросов заказчику.",
        "example": "Преобразует клиентский бриф в варианты рекламных сообщений, проверяет обязательные элементы и собирает материалы на согласование.",
        "scene": {
            "title": "Рекламные варианты",
            "input": "Бриф и бренд",
            "output": "Варианты объявлений"
        },
        "alt": "ИИ-агент для направления «Рекламным агентствам»: рекламные варианты",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/advertising-agencies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/advertising-agencies.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            }
        ]
    },
    {
        "slug": "smm-teams",
        "label": "SMM-командам",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Контент и ответы аудитории должны сохранять единый тон при большом потоке задач.",
        "workflow": [
            "Читает рубрикатор и базу бренда",
            "Готовит публикации и ответы по запросам",
            "Передаёт спорные обращения ответственным"
        ],
        "outcome": "Очередь материалов и ответов для редакторского согласования.",
        "example": "По рубрикатору и базе бренда готовит черновики публикаций, классифицирует комментарии и передаёт сложные обращения ответственным.",
        "scene": {
            "title": "План публикаций",
            "input": "Рубрики и вопросы",
            "output": "Публикации и ответы"
        },
        "alt": "ИИ-агент для направления «SMM-командам»: план публикаций",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/smm-teams.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/smm-teams.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "content-studios",
        "label": "Контент-студиям",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Из интервью сложно быстро получить структуру текста и проверяемую фактуру.",
        "workflow": [
            "Разбирает интервью и исходные материалы",
            "Собирает план и черновик текста",
            "Выделяет факты для проверки редактором"
        ],
        "outcome": "Черновик с прослеживаемыми источниками и списком редакторских вопросов.",
        "example": "Из интервью и исходных материалов собирает план статьи, черновик и список фактов для редакторской проверки.",
        "scene": {
            "title": "Структура статьи",
            "input": "Интервью и фактура",
            "output": "План и черновик"
        },
        "alt": "ИИ-агент для направления «Контент-студиям»: структура статьи",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/content-studios.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/content-studios.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            }
        ]
    },
    {
        "slug": "pr-agencies",
        "label": "PR-агентствам",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Упоминания бренда разрозненны, а ответы нужно согласовывать с текущей позицией.",
        "workflow": [
            "Получает доступную выгрузку мониторинга",
            "Группирует темы и контекст упоминаний",
            "Готовит сводку и варианты ответов"
        ],
        "outcome": "Подготовленная картина обсуждения и материалы для согласования PR-командой.",
        "example": "Из доступного мониторинга собирает тематическую сводку упоминаний и готовит черновики ответов с учётом утверждённой позиции бренда.",
        "scene": {
            "title": "Мониторинг бренда",
            "input": "Упоминания бренда",
            "output": "Сводка и ответы"
        },
        "alt": "ИИ-агент для направления «PR-агентствам»: мониторинг бренда",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/pr-agencies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/pr-agencies.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            }
        ]
    },
    {
        "slug": "video-production",
        "label": "Видеопродакшенам",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "В длинной записи трудно найти фрагменты для монтажа и публикации.",
        "workflow": [
            "Получает расшифровку с таймкодами",
            "Выделяет смысловые блоки и цитаты",
            "Готовит монтажный план и описания"
        ],
        "outcome": "Навигация по отснятому материалу и основа монтажного задания.",
        "example": "Преобразует расшифровку съёмки в сценарный план монтажа, список таймкодов и варианты описаний ролика.",
        "scene": {
            "title": "Монтажный план",
            "input": "Видео и расшифровка",
            "output": "Сцены с таймкодами"
        },
        "alt": "ИИ-агент для направления «Видеопродакшенам»: монтажный план",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/video-production.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/video-production.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            }
        ]
    },
    {
        "slug": "design-studios",
        "label": "Дизайн-студиям",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Правки разбросаны по чатам и противоречат предыдущим договорённостям.",
        "workflow": [
            "Собирает требования и историю правок",
            "Группирует изменения по элементам проекта",
            "Отмечает противоречия для согласования"
        ],
        "outcome": "Один актуальный список правок с понятными исходными комментариями.",
        "example": "Собирает бриф, выделяет ограничения из переписки и формирует согласованный список правок по версиям проекта.",
        "scene": {
            "title": "Согласование правок",
            "input": "Бриф и комментарии",
            "output": "Список изменений"
        },
        "alt": "ИИ-агент для направления «Дизайн-студиям»: согласование правок",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/design-studios.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/design-studios.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "branding-agencies",
        "label": "Брендинговым агентствам",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Материалы клиента расходятся с тоном и терминологией бренд-платформы.",
        "workflow": [
            "Принимает бренд-платформу и материалы",
            "Сопоставляет тексты с заданными правилами",
            "Готовит замечания и варианты формулировок"
        ],
        "outcome": "Редакторский список изменений для последовательной коммуникации бренда.",
        "example": "Сопоставляет материалы клиента с бренд-платформой и готовит редакторский список несоответствий тону и терминологии.",
        "scene": {
            "title": "Единый стиль",
            "input": "Бренд и материалы",
            "output": "Редакторские замечания"
        },
        "alt": "ИИ-агент для направления «Брендинговым агентствам»: единый стиль",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/branding-agencies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/branding-agencies.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "event-agencies",
        "label": "Event-агентствам",
        "groupId": "marketing",
        "groupLabel": "Маркетинг и креатив",
        "pain": "Сметы подрядчиков и сроки согласований приходится вручную сводить в проект.",
        "workflow": [
            "Собирает бриф и предложения подрядчиков",
            "Нормализует состав работ и условия",
            "Выделяет открытые согласования и сроки"
        ],
        "outcome": "Сравнимые предложения и актуальный список организационных задач.",
        "example": "Собирает требования к мероприятию, структурирует предложения подрядчиков и ведёт список согласований и контрольных сроков.",
        "scene": {
            "title": "План события",
            "input": "Бриф и подрядчики",
            "output": "Смета и согласования"
        },
        "alt": "ИИ-агент для направления «Event-агентствам»: план события",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/event-agencies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/event-agencies.svg",
        "links": [
            {
                "title": "Автоматизация маркетинга и контента",
                "href": "/services/ai-marketing-content"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "online-stores",
        "label": "Интернет-магазинам",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Покупатели повторно спрашивают характеристики, наличие и условия доставки.",
        "workflow": [
            "Уточняет потребность покупателя",
            "Находит сведения в актуальном каталоге",
            "Передаёт менеджеру запрос с выбранными позициями"
        ],
        "outcome": "Клиент получает ответы по каталогу, менеджер — подготовленное обращение.",
        "example": "Отвечает по каталогу и условиям доставки, уточняет совместимость по указанным характеристикам и передаёт готовый запрос менеджеру.",
        "scene": {
            "title": "Подбор товара",
            "input": "Вопрос и каталог",
            "output": "Подборка покупателю"
        },
        "alt": "ИИ-агент для направления «Интернет-магазинам»: подбор товара",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/online-stores.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/online-stores.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "marketplace-sellers",
        "label": "Продавцам маркетплейсов",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Отзывы и вопросы на разных площадках сложно превратить в понятные задачи.",
        "workflow": [
            "Собирает разрешённые выгрузки обращений",
            "Группирует проблемы и вопросы по товарам",
            "Готовит ответы и сводку повторяющихся причин"
        ],
        "outcome": "Системная обратная связь для карточек товаров и работы продавца.",
        "example": "Систематизирует отзывы и вопросы, готовит ответы по данным товара и выделяет повторяющиеся причины возвратов.",
        "scene": {
            "title": "Сводка отзывов",
            "input": "Отзывы и вопросы",
            "output": "Темы и черновики"
        },
        "alt": "ИИ-агент для направления «Продавцам маркетплейсов»: сводка отзывов",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/marketplace-sellers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/marketplace-sellers.svg",
        "links": [
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "wholesale-companies",
        "label": "Оптовым компаниям",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Заказы из писем содержат неформальные названия и требуют ручного переноса.",
        "workflow": [
            "Разбирает письмо или файл заказа",
            "Сопоставляет позиции с номенклатурой",
            "Готовит предложение и отмечает неоднозначности"
        ],
        "outcome": "Черновик заказа с выделенными вопросами перед подтверждением менеджером.",
        "example": "Разбирает заказ из письма или файла, сопоставляет позиции с номенклатурой и готовит черновик предложения на согласование.",
        "scene": {
            "title": "Оптовый заказ",
            "input": "Письмо с заказом",
            "output": "Черновик предложения"
        },
        "alt": "ИИ-агент для направления «Оптовым компаниям»: оптовый заказ",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/wholesale-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/wholesale-companies.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "distributors",
        "label": "Дистрибьюторам",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Менеджеры ищут аналоги и характеристики сразу в нескольких каталогах.",
        "workflow": [
            "Уточняет технический запрос",
            "Ищет позиции и аналоги по разрешённым данным",
            "Собирает подборку с характеристиками и остатками"
        ],
        "outcome": "Подготовленная подборка для проверки и ответа клиенту.",
        "example": "Находит подходящие позиции и аналоги в утверждённом каталоге, учитывает доступные остатки и передаёт подборку менеджеру.",
        "scene": {
            "title": "Каталог аналогов",
            "input": "Технический запрос",
            "output": "Модели и аналоги"
        },
        "alt": "ИИ-агент для направления «Дистрибьюторам»: каталог аналогов",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/distributors.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/distributors.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "retail-chains",
        "label": "Розничным сетям",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Типовые вопросы магазинов перегружают центральный офис и теряются в чатах.",
        "workflow": [
            "Принимает вопрос от сотрудника магазина",
            "Находит правило или инструкцию",
            "Маршрутизирует исключение в профильную команду"
        ],
        "outcome": "Единый канал помощи магазинам и меньше повторного объяснения правил.",
        "example": "Собирает обращения магазинов по товарам и операциям, отвечает по регламентам и направляет исключения профильным командам.",
        "scene": {
            "title": "Поддержка магазина",
            "input": "Вопрос торговой точки",
            "output": "Ответ и маршрутизация"
        },
        "alt": "ИИ-агент для направления «Розничным сетям»: поддержка магазина",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/retail-chains.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/retail-chains.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "franchise-networks",
        "label": "Франчайзинговым сетям",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Партнёрам сложно ориентироваться в стандартах и задачах запуска точки.",
        "workflow": [
            "Определяет этап работы партнёра",
            "Находит соответствующие стандарты сети",
            "Собирает контрольный список и обращения"
        ],
        "outcome": "Понятный маршрут по стандартам и подготовленные запросы управляющей компании.",
        "example": "Помогает партнёрам найти стандарты сети, пройти контрольный список открытия точки и оформить запрос управляющей компании.",
        "scene": {
            "title": "Стандарт франшизы",
            "input": "Вопрос партнёра",
            "output": "Правила и шаги"
        },
        "alt": "ИИ-агент для направления «Франчайзинговым сетям»: стандарт франшизы",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/franchise-networks.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/franchise-networks.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "equipment-suppliers",
        "label": "Поставщикам оборудования",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Технические запросы сложно быстро связать с моделями и условиями поставки.",
        "workflow": [
            "Извлекает требования из запроса",
            "Сопоставляет их с каталогом оборудования",
            "Готовит подборку и черновик предложения"
        ],
        "outcome": "Материалы для инженерной проверки и подготовки ответа заказчику.",
        "example": "По техническому запросу находит подходящие модели, сопоставляет характеристики и собирает коммерческое предложение для инженера и менеджера.",
        "scene": {
            "title": "Технический подбор",
            "input": "Технические требования",
            "output": "Подборка оборудования"
        },
        "alt": "ИИ-агент для направления «Поставщикам оборудования»: технический подбор",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/equipment-suppliers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/equipment-suppliers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "furniture-stores",
        "label": "Магазинам мебели",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Покупатель не знает, какие размеры и параметры сообщить для подбора мебели.",
        "workflow": [
            "Уточняет размеры, материалы и бюджет",
            "Подбирает доступные позиции каталога",
            "Собирает заявку на расчёт или замер"
        ],
        "outcome": "Структурированный запрос с исходными данными для консультанта.",
        "example": "Уточняет размеры, материалы и бюджет покупателя, подбирает позиции из каталога и оформляет заявку на расчёт или замер.",
        "scene": {
            "title": "Мебель под запрос",
            "input": "Размеры и пожелания",
            "output": "Подборка для замера"
        },
        "alt": "ИИ-агент для направления «Магазинам мебели»: мебель под запрос",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/furniture-stores.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/furniture-stores.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "auto-parts-stores",
        "label": "Магазинам автозапчастей",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Неполные сведения об автомобиле ведут к повторным уточнениям при подборе.",
        "workflow": [
            "Собирает необходимые данные автомобиля",
            "Ищет позиции в подключённом каталоге",
            "Передаёт подбор специалисту на подтверждение"
        ],
        "outcome": "Подготовленный запрос на подбор без обещаний непроверенной совместимости.",
        "example": "Собирает данные автомобиля и запроса, ищет позиции в подключённом каталоге и передаёт подбор на проверку специалисту.",
        "scene": {
            "title": "Подбор запчастей",
            "input": "Данные автомобиля",
            "output": "Подбор на проверку"
        },
        "alt": "ИИ-агент для направления «Магазинам автозапчастей»: подбор запчастей",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/auto-parts-stores.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/auto-parts-stores.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "flower-shops",
        "label": "Цветочным магазинам",
        "groupId": "commerce",
        "groupLabel": "Торговля и продажи",
        "pain": "Для каждого заказа нужно отдельно уточнять повод, бюджет и доставку.",
        "workflow": [
            "Собирает параметры заказа",
            "Показывает доступные композиции",
            "Передаёт заказ флористу на подтверждение"
        ],
        "outcome": "Полная карточка заказа с пожеланиями и данными доставки.",
        "example": "Уточняет повод, бюджет, дату и адрес доставки, предлагает доступные композиции и создаёт заказ для подтверждения флористом.",
        "scene": {
            "title": "Заказ букета",
            "input": "Повод и бюджет",
            "output": "Заказ флористу"
        },
        "alt": "ИИ-агент для направления «Цветочным магазинам»: заказ букета",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/flower-shops.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/flower-shops.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "real-estate-agencies",
        "label": "Агентствам недвижимости",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Лиды приходят без бюджета, предпочтений и готовности к просмотру.",
        "workflow": [
            "Уточняет параметры поиска",
            "Выбирает объекты из актуальной базы",
            "Согласует удобное время связи с агентом"
        ],
        "outcome": "Агент получает подборку и контекст потребности до первого разговора.",
        "example": "Уточняет параметры поиска, подбирает объекты из базы и передаёт агенту заявку с предпочтениями клиента и удобным временем показа.",
        "scene": {
            "title": "Подбор квартиры",
            "input": "Запрос покупателя",
            "output": "Объекты и показ"
        },
        "alt": "ИИ-агент для направления «Агентствам недвижимости»: подбор квартиры",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/real-estate-agencies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/real-estate-agencies.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "property-developers",
        "label": "Застройщикам",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Клиенты повторяют вопросы о планировках, корпусах и доступных вариантах.",
        "workflow": [
            "Уточняет параметры желаемой квартиры",
            "Находит сведения в базе проекта",
            "Фиксирует интерес и заявку на консультацию"
        ],
        "outcome": "Подготовленное обращение с выбранными параметрами и объектами.",
        "example": "Отвечает по актуальной базе объектов, планировок и этапов проекта, фиксирует интерес к квартире и записывает на консультацию.",
        "scene": {
            "title": "Выбор планировки",
            "input": "Пожелания клиента",
            "output": "Квартира и запись"
        },
        "alt": "ИИ-агент для направления «Застройщикам»: выбор планировки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/property-developers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/property-developers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "construction-companies",
        "label": "Строительным компаниям",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Статусы площадки разбросаны по журналам, фотографиям и рабочим чатам.",
        "workflow": [
            "Собирает сообщения по участкам",
            "Соотносит их с этапами работ",
            "Отмечает отсутствующие подтверждения и открытые вопросы"
        ],
        "outcome": "Сводка по объекту с указанием источников и пробелов.",
        "example": "Собирает статус работ из журналов и сообщений, отмечает отсутствие подтверждений и готовит отчёт по участкам для руководителя проекта.",
        "scene": {
            "title": "Статус стройки",
            "input": "Журналы и сообщения",
            "output": "Сводка по участкам"
        },
        "alt": "ИИ-агент для направления «Строительным компаниям»: статус стройки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/construction-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/construction-companies.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "renovation-teams",
        "label": "Ремонтным бригадам",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "На первичную оценку приходят заявки без размеров и описания работ.",
        "workflow": [
            "Уточняет параметры помещения и задачи",
            "Собирает фотографии и ограничения",
            "Готовит бриф для замерщика"
        ],
        "outcome": "Подготовленный выезд и исходные данные для будущего расчёта.",
        "example": "Собирает фотографии, параметры помещения и пожелания клиента, формирует бриф для замерщика и перечень вопросов перед расчётом.",
        "scene": {
            "title": "Бриф ремонта",
            "input": "Фото и размеры",
            "output": "Задание замерщику"
        },
        "alt": "ИИ-агент для направления «Ремонтным бригадам»: бриф ремонта",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/renovation-teams.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/renovation-teams.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "architecture-firms",
        "label": "Архитектурным бюро",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Изменения требований заказчика трудно отслеживать между версиями задания.",
        "workflow": [
            "Собирает исходное задание и комментарии",
            "Сравнивает новые решения с прежними",
            "Ведёт перечень изменений и противоречий"
        ],
        "outcome": "Актуальная история требований для согласования архитектурного решения.",
        "example": "Сводит исходные требования и решения заказчика, находит противоречия между версиями задания и ведёт список изменений проекта.",
        "scene": {
            "title": "История проекта",
            "input": "Задание и изменения",
            "output": "Актуальные требования"
        },
        "alt": "ИИ-агент для направления «Архитектурным бюро»: история проекта",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/architecture-firms.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/architecture-firms.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "engineering-design-firms",
        "label": "Проектным институтам",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Сотрудники долго ищут исходники и прошлые решения в проектном архиве.",
        "workflow": [
            "Уточняет объект и инженерный вопрос",
            "Находит документы в доступном архиве",
            "Собирает подборку с версиями и источниками"
        ],
        "outcome": "Найденные исходные материалы, пригодные для проверки инженером.",
        "example": "Находит документы и предыдущие решения в проектном архиве и собирает комплект исходных материалов по запросу инженера.",
        "scene": {
            "title": "Архив чертежей",
            "input": "Инженерный вопрос",
            "output": "Исходные материалы"
        },
        "alt": "ИИ-агент для направления «Проектным институтам»: архив чертежей",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/engineering-design-firms.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/engineering-design-firms.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "property-management",
        "label": "Управляющим компаниям",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Жители пишут в разные каналы, а заявки поступают без адреса и деталей.",
        "workflow": [
            "Принимает обращение и уточняет адрес",
            "Определяет категорию по правилам компании",
            "Создаёт заявку и сообщает её статус"
        ],
        "outcome": "Единая карточка обращения для жителя и исполнителя.",
        "example": "Принимает обращения жителей, уточняет адрес и категорию проблемы, создаёт заявку исполнителю и сообщает её статус.",
        "scene": {
            "title": "Заявка жителя",
            "input": "Адрес и обращение",
            "output": "Заявка исполнителю"
        },
        "alt": "ИИ-агент для направления «Управляющим компаниям»: заявка жителя",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/property-management.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/property-management.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "homeowners-associations",
        "label": "ТСЖ",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Правление многократно объясняет объявления и собирает вопросы вручную.",
        "workflow": [
            "Находит утверждённую информацию по вопросу",
            "Принимает обращение собственника",
            "Группирует темы для правления и собрания"
        ],
        "outcome": "Доступные ответы по документам дома и систематизированные обращения.",
        "example": "Отвечает по утверждённым объявлениям и правилам дома, собирает обращения и готовит сводку вопросов к общему собранию.",
        "scene": {
            "title": "Вопросы собственников",
            "input": "Вопросы жителей",
            "output": "Темы для собрания"
        },
        "alt": "ИИ-агент для направления «ТСЖ»: вопросы собственников",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/homeowners-associations.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/homeowners-associations.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "commercial-property-operators",
        "label": "Коммерческой недвижимости",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Запросы арендаторов приходится вручную сверять с доступными помещениями.",
        "workflow": [
            "Уточняет площадь, назначение и сроки",
            "Находит варианты в базе помещений",
            "Готовит заявку на просмотр менеджеру"
        ],
        "outcome": "Подборка помещений и полный контекст запроса арендатора.",
        "example": "Подбирает доступные помещения по площади и назначению, собирает заявку арендатора и готовит данные для просмотра.",
        "scene": {
            "title": "Аренда помещения",
            "input": "Площадь и назначение",
            "output": "Варианты для просмотра"
        },
        "alt": "ИИ-агент для направления «Коммерческой недвижимости»: аренда помещения",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/commercial-property-operators.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/commercial-property-operators.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "building-systems-contractors",
        "label": "Инженерным подрядчикам",
        "groupId": "construction-property",
        "groupLabel": "Недвижимость и строительство",
        "pain": "Для выезда инженера не хватает характеристик объекта и системы.",
        "workflow": [
            "Уточняет вид работ и параметры объекта",
            "Собирает документы и фотографии",
            "Готовит комплект исходных данных инженеру"
        ],
        "outcome": "Подготовленная заявка на обследование, монтаж или обслуживание.",
        "example": "Разбирает заявку на монтаж или обслуживание систем, собирает исходные параметры и формирует комплект документов для выезда инженера.",
        "scene": {
            "title": "Выезд инженера",
            "input": "Объект и система",
            "output": "Комплект для выезда"
        },
        "alt": "ИИ-агент для направления «Инженерным подрядчикам»: выезд инженера",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/building-systems-contractors.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/building-systems-contractors.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "machine-building-plants",
        "label": "Машиностроительным заводам",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Инструкции и история обслуживания оборудования находятся в разных хранилищах.",
        "workflow": [
            "Уточняет модель оборудования и запрос",
            "Находит доступные инструкции и записи",
            "Собирает справку и заявку на проверку"
        ],
        "outcome": "Материалы для специалиста с привязкой к конкретному оборудованию.",
        "example": "Находит инструкции и историю обслуживания оборудования, собирает справку по запросу сотрудника и создаёт заявку на проверку.",
        "scene": {
            "title": "История станка",
            "input": "Запрос по оборудованию",
            "output": "Инструкция и заявка"
        },
        "alt": "ИИ-агент для направления «Машиностроительным заводам»: история станка",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/machine-building-plants.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/machine-building-plants.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "metalworking-companies",
        "label": "Металлообработке",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Заявки на изготовление приходят без части параметров, нужных технологу.",
        "workflow": [
            "Извлекает параметры заказа",
            "Сопоставляет их с внутренним списком требований",
            "Запрашивает недостающее и передаёт технологу"
        ],
        "outcome": "Комплектный запрос для технологической проработки и оценки.",
        "example": "Из запроса заказчика извлекает материал, количество и требования, отмечает недостающие параметры и передаёт заявку технологу.",
        "scene": {
            "title": "Заказ детали",
            "input": "Чертёж и параметры",
            "output": "Заявка технологу"
        },
        "alt": "ИИ-агент для направления «Металлообработке»: заказ детали",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/metalworking-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/metalworking-companies.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "food-manufacturers",
        "label": "Пищевым производствам",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Записи по партиям неполные и требуют ручного объединения перед проверкой.",
        "workflow": [
            "Собирает разрешённые журналы по партии",
            "Проверяет наличие заданных полей",
            "Готовит пакет исключений отделу качества"
        ],
        "outcome": "Собранные записи и перечень пробелов для проверки сотрудником.",
        "example": "Сводит производственные журналы и сведения о партиях, отмечает неполные записи и готовит пакет на проверку отдела качества.",
        "scene": {
            "title": "Контроль партии",
            "input": "Журналы партии",
            "output": "Пакет отделу качества"
        },
        "alt": "ИИ-агент для направления «Пищевым производствам»: контроль партии",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/food-manufacturers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/food-manufacturers.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "garment-manufacturers",
        "label": "Швейным производствам",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Версии заказов по моделям, размерам и тканям расходятся между участниками.",
        "workflow": [
            "Разбирает актуальный заказ",
            "Сверяет модели, размеры и материалы",
            "Выделяет изменения и вопросы производства"
        ],
        "outcome": "Согласуемая спецификация заказа и ясный список изменений.",
        "example": "Структурирует заказ по моделям, размерам и материалам, сверяет версии задания и готовит сводку для планирования производства.",
        "scene": {
            "title": "Спецификация пошива",
            "input": "Модели и размеры",
            "output": "План заказа"
        },
        "alt": "ИИ-агент для направления «Швейным производствам»: спецификация пошива",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/garment-manufacturers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/garment-manufacturers.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "furniture-manufacturers",
        "label": "Мебельным фабрикам",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Нестандартные позиции заказа требуют многократных уточнений между отделами.",
        "workflow": [
            "Принимает спецификацию заказа",
            "Сверяет позиции с утверждённой номенклатурой",
            "Выделяет нестандартные требования конструктору"
        ],
        "outcome": "Структурированное задание с перечнем вопросов до запуска работ.",
        "example": "Сопоставляет спецификацию заказа с утверждённой номенклатурой, выделяет нестандартные позиции и передаёт вопросы конструктору.",
        "scene": {
            "title": "Заказ производства",
            "input": "Спецификация мебели",
            "output": "Вопросы конструктору"
        },
        "alt": "ИИ-агент для направления «Мебельным фабрикам»: заказ производства",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/furniture-manufacturers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/furniture-manufacturers.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "logistics-companies",
        "label": "Логистическим компаниям",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "На расчёт перевозки поступают заявки без размеров, адресов или сроков.",
        "workflow": [
            "Собирает параметры груза и маршрута",
            "Проверяет комплектность заявки",
            "Передаёт её сотруднику и сообщает доступный статус"
        ],
        "outcome": "Полная заявка на перевозку и понятная клиенту коммуникация.",
        "example": "Собирает параметры перевозки, проверяет полноту заявки и сообщает клиенту статусы из подключённой системы.",
        "scene": {
            "title": "Заявка перевозки",
            "input": "Груз и маршрут",
            "output": "Данные для расчёта"
        },
        "alt": "ИИ-агент для направления «Логистическим компаниям»: заявка перевозки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/logistics-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/logistics-companies.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "fulfillment-warehouses",
        "label": "Складам и фулфилменту",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Запросы по приёмке, сборке и возвратам трудно связать с операциями склада.",
        "workflow": [
            "Уточняет заказ и тип обращения",
            "Находит связанные записи в системе",
            "Формирует задачу ответственному сотруднику"
        ],
        "outcome": "Разобранное обращение с контекстом складских операций.",
        "example": "Объединяет запросы по приёмке, сборке и возвратам, находит связанные операции и формирует задачу ответственному сотруднику.",
        "scene": {
            "title": "Складское обращение",
            "input": "Заказ и операция",
            "output": "Задача сотруднику"
        },
        "alt": "ИИ-агент для направления «Складам и фулфилменту»: складское обращение",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/fulfillment-warehouses.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/fulfillment-warehouses.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            }
        ]
    },
    {
        "slug": "courier-services",
        "label": "Курьерским службам",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Операторы тратят время на уточнение заказа перед решением проблемы доставки.",
        "workflow": [
            "Принимает вопрос и номер заказа",
            "Получает актуальный доступный статус",
            "Передаёт исключение диспетчеру с контекстом"
        ],
        "outcome": "Подготовленное обращение, по которому диспетчер может действовать.",
        "example": "Классифицирует обращения по доставкам, уточняет номер заказа и передаёт диспетчеру случаи, требующие изменения маршрута.",
        "scene": {
            "title": "Статус доставки",
            "input": "Заказ клиента",
            "output": "Ответ или эскалация"
        },
        "alt": "ИИ-агент для направления «Курьерским службам»: статус доставки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/courier-services.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/courier-services.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "freight-forwarders",
        "label": "Экспедиторам",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Документы и контрольные сроки перевозки теряются в отдельных переписках.",
        "workflow": [
            "Собирает материалы по перевозке",
            "Отмечает недостающие документы и подтверждения",
            "Напоминает сотруднику о контрольных событиях"
        ],
        "outcome": "Единая карточка перевозки с актуальным списком незакрытых действий.",
        "example": "Собирает документы и контрольные сроки перевозки в одну карточку и напоминает сотруднику о недостающих подтверждениях.",
        "scene": {
            "title": "Папка перевозки",
            "input": "Документы и сроки",
            "output": "Контрольные события"
        },
        "alt": "ИИ-агент для направления «Экспедиторам»: папка перевозки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/freight-forwarders.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/freight-forwarders.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "customs-representatives",
        "label": "Таможенным представителям",
        "groupId": "industry-logistics",
        "groupLabel": "Производство и логистика",
        "pain": "Реквизиты инвойсов и упаковочных листов приходится вручную перепроверять.",
        "workflow": [
            "Извлекает поля из документов",
            "Сопоставляет данные по заданной схеме",
            "Готовит список расхождений специалисту"
        ],
        "outcome": "Сверенные исходные данные и обозначенные вопросы для профессиональной проверки.",
        "example": "Извлекает данные из инвойсов и упаковочных листов, сопоставляет реквизиты и отмечает расхождения для специалиста.",
        "scene": {
            "title": "Сверка инвойса",
            "input": "Инвойс и список",
            "output": "Список расхождений"
        },
        "alt": "ИИ-агент для направления «Таможенным представителям»: сверка инвойса",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/customs-representatives.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/customs-representatives.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "auto-repair-shops",
        "label": "Автосервисам",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Администратор долго уточняет автомобиль, симптомы и удобное время приёма.",
        "workflow": [
            "Собирает данные автомобиля и слова клиента",
            "Уточняет время и контактные сведения",
            "Передаёт мастеру заявку на диагностику"
        ],
        "outcome": "Запись с полезным контекстом до разговора с мастером.",
        "example": "Собирает марку, модель и описание неисправности со слов клиента, уточняет удобное время и передаёт мастеру заявку на диагностику.",
        "scene": {
            "title": "Запись в сервис",
            "input": "Автомобиль и запрос",
            "output": "Заявка мастеру"
        },
        "alt": "ИИ-агент для направления «Автосервисам»: запись в сервис",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/auto-repair-shops.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/auto-repair-shops.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "car-dealers",
        "label": "Автодилерам",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Менеджер получает обращения без понимания бюджета и интересующих комплектаций.",
        "workflow": [
            "Уточняет пожелания покупателя",
            "Подбирает доступные автомобили из каталога",
            "Передаёт заявку на консультацию или тест-драйв"
        ],
        "outcome": "Квалифицированный запрос с выбранными вариантами и пожеланиями клиента.",
        "example": "Подбирает автомобили из доступного каталога по параметрам клиента, уточняет вопросы и записывает на тест-драйв.",
        "scene": {
            "title": "Выбор автомобиля",
            "input": "Пожелания покупателя",
            "output": "Заявка на тест-драйв"
        },
        "alt": "ИИ-агент для направления «Автодилерам»: выбор автомобиля",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/car-dealers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/car-dealers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "detailing-centers",
        "label": "Детейлинг-центрам",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Клиенту трудно описать нужные работы и понять состав услуг.",
        "workflow": [
            "Уточняет состояние и пожелания по автомобилю",
            "Показывает состав услуг по базе",
            "Готовит заявку на осмотр или запись"
        ],
        "outcome": "Понятное обращение с выбранными услугами и вопросами клиента.",
        "example": "Уточняет состояние автомобиля и желаемые работы, объясняет состав услуг по прайсу и готовит заявку администратору.",
        "scene": {
            "title": "Уход за автомобилем",
            "input": "Состояние и пожелания",
            "output": "Заявка на осмотр"
        },
        "alt": "ИИ-агент для направления «Детейлинг-центрам»: уход за автомобилем",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/detailing-centers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/detailing-centers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "tire-services",
        "label": "Шиномонтажам",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "В сезон запись перегружается повторяющимися уточнениями и переносами.",
        "workflow": [
            "Собирает параметры колёс и работ",
            "Проверяет доступные интервалы",
            "Создаёт или переносит согласованную запись"
        ],
        "outcome": "Упорядоченная запись с данными, нужными сотруднику шиномонтажа.",
        "example": "Собирает параметры колёс, нужные работы и время визита, показывает доступные интервалы и создаёт запись.",
        "scene": {
            "title": "Запись шиномонтажа",
            "input": "Колёса и время",
            "output": "Подтверждённая запись"
        },
        "alt": "ИИ-агент для направления «Шиномонтажам»: запись шиномонтажа",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/tire-services.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/tire-services.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "car-rental",
        "label": "Автопрокату",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Для каждой заявки приходится уточнять даты и повторять условия аренды.",
        "workflow": [
            "Собирает даты и требования к автомобилю",
            "Находит доступные варианты",
            "Разъясняет правила и передаёт заявку менеджеру"
        ],
        "outcome": "Подготовленная заявка с выбранным автомобилем и сроком аренды.",
        "example": "Подбирает доступные автомобили по датам и классу, разъясняет утверждённые условия аренды и передаёт заявку менеджеру.",
        "scene": {
            "title": "Аренда автомобиля",
            "input": "Даты и класс авто",
            "output": "Заявка на аренду"
        },
        "alt": "ИИ-агент для направления «Автопрокату»: аренда автомобиля",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/car-rental.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/car-rental.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "taxi-fleets",
        "label": "Таксопаркам",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Вопросы водителей по правилам и обслуживанию поступают разным сотрудникам.",
        "workflow": [
            "Определяет тему обращения",
            "Находит утверждённое правило или инструкцию",
            "Создаёт заявку нужному сотруднику парка"
        ],
        "outcome": "Единая точка входа для типовых вопросов и сервисных заявок.",
        "example": "Отвечает водителям по внутренним правилам, принимает заявки на обслуживание автомобиля и направляет вопросы нужному сотруднику.",
        "scene": {
            "title": "Помощь водителю",
            "input": "Вопрос водителя",
            "output": "Ответ или заявка"
        },
        "alt": "ИИ-агент для направления «Таксопаркам»: помощь водителю",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/taxi-fleets.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/taxi-fleets.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "driving-schools",
        "label": "Автошколам",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Администратор повторно объясняет программы, расписание и порядок записи.",
        "workflow": [
            "Уточняет интересующую программу",
            "Находит расписание и условия",
            "Собирает заявку или ссылку на материал"
        ],
        "outcome": "Понятный путь от вопроса ученика к записи или учебному материалу.",
        "example": "Отвечает по программам и расписанию, собирает заявки учеников и помогает найти утверждённые учебные материалы.",
        "scene": {
            "title": "Запись на обучение",
            "input": "Вопрос ученика",
            "output": "Программа и заявка"
        },
        "alt": "ИИ-агент для направления «Автошколам»: запись на обучение",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/driving-schools.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/driving-schools.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "roadside-assistance",
        "label": "Выездной техпомощи",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Диспетчеру приходится заново выяснять местоположение и характер проблемы.",
        "workflow": [
            "Уточняет место и контакт",
            "Собирает данные автомобиля и запроса",
            "Передаёт готовую заявку диспетчеру"
        ],
        "outcome": "Полные исходные сведения для организации выездной помощи.",
        "example": "Уточняет местоположение и характер запроса, собирает данные автомобиля и передаёт диспетчеру подготовленную заявку.",
        "scene": {
            "title": "Вызов техпомощи",
            "input": "Место и проблема",
            "output": "Заявка диспетчеру"
        },
        "alt": "ИИ-агент для направления «Выездной техпомощи»: вызов техпомощи",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/roadside-assistance.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/roadside-assistance.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "passenger-transport",
        "label": "Пассажирским перевозчикам",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Запросы на поездки не содержат всех данных для расчёта и планирования.",
        "workflow": [
            "Уточняет маршрут, дату и число пассажиров",
            "Собирает требования к поездке",
            "Формирует заявку для диспетчера"
        ],
        "outcome": "Единый бриф перевозки для подтверждения условий сотрудником.",
        "example": "Уточняет маршрут, дату и число пассажиров, собирает требования к поездке и формирует заявку диспетчеру.",
        "scene": {
            "title": "Маршрут поездки",
            "input": "Маршрут и группа",
            "output": "Бриф диспетчеру"
        },
        "alt": "ИИ-агент для направления «Пассажирским перевозчикам»: маршрут поездки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/passenger-transport.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/passenger-transport.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "construction-equipment-rental",
        "label": "Аренде спецтехники",
        "groupId": "automotive-transport",
        "groupLabel": "Автобизнес и транспорт",
        "pain": "Клиент описывает работу, но не знает, какие параметры техники важны.",
        "workflow": [
            "Уточняет задачу и условия объекта",
            "Находит варианты в каталоге",
            "Собирает заявку на расчёт аренды"
        ],
        "outcome": "Подборка для проверки специалистом и полные данные по объекту.",
        "example": "Подбирает доступную технику по виду работ и параметрам объекта, уточняет сроки и передаёт данные для расчёта аренды.",
        "scene": {
            "title": "Подбор спецтехники",
            "input": "Работы и объект",
            "output": "Варианты для расчёта"
        },
        "alt": "ИИ-агент для направления «Аренде спецтехники»: подбор спецтехники",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/construction-equipment-rental.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/construction-equipment-rental.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "medical-clinics",
        "label": "Клиникам",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Административные вопросы и запись занимают время сотрудников клиники.",
        "workflow": [
            "Уточняет организационный запрос",
            "Использует утверждённую базу и расписание",
            "Оформляет запись или передаёт вопрос сотруднику"
        ],
        "outcome": "Подготовленные обращения и доступная организационная информация для пациентов.",
        "example": "Отвечает по административным вопросам, расписанию и утверждённой подготовке к приёму, собирает заявку на запись и передаёт медицинские вопросы сотруднику.",
        "scene": {
            "title": "Запись на приём",
            "input": "Вопрос и расписание",
            "output": "Заявка администратору"
        },
        "alt": "ИИ-агент для направления «Клиникам»: запись на приём",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/medical-clinics.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/medical-clinics.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "dental-clinics",
        "label": "Стоматологиям",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Пациенты многократно уточняют порядок записи и перечень услуг.",
        "workflow": [
            "Собирает цель обращения без постановки диагноза",
            "Объясняет административные условия",
            "Передаёт заявку администратору"
        ],
        "outcome": "Понятная запись на консультацию с вопросами пациента для клиники.",
        "example": "Уточняет цель обращения, объясняет порядок записи и доступные услуги по базе клиники и передаёт заявку администратору.",
        "scene": {
            "title": "Визит к стоматологу",
            "input": "Цель обращения",
            "output": "Запись на консультацию"
        },
        "alt": "ИИ-агент для направления «Стоматологиям»: визит к стоматологу",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/dental-clinics.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/dental-clinics.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "veterinary-clinics",
        "label": "Ветклиникам",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Перед записью нужно повторно собирать данные владельца и питомца.",
        "workflow": [
            "Уточняет контакт и данные питомца",
            "Фиксирует описание обращения владельцем",
            "Передаёт сведения сотруднику клиники"
        ],
        "outcome": "Подготовленная заявка на приём с сохранённым описанием обращения.",
        "example": "Собирает данные владельца и питомца, помогает записаться на приём и передаёт сообщения о состоянии животного сотруднику клиники.",
        "scene": {
            "title": "Заявка владельца",
            "input": "Питомец и обращение",
            "output": "Сведения для приёма"
        },
        "alt": "ИИ-агент для направления «Ветклиникам»: заявка владельца",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/veterinary-clinics.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/veterinary-clinics.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "pharmacy-chains",
        "label": "Аптечным сетям",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Типовые запросы о наличии и заказах занимают время фармацевтов.",
        "workflow": [
            "Уточняет аптеку и искомую позицию",
            "Читает наличие или статус заказа",
            "Передаёт профильные вопросы фармацевту"
        ],
        "outcome": "Ответы по наличию и заказам без самостоятельного подбора лечения.",
        "example": "Отвечает по наличию и статусу заказа из учётной системы, сообщает режим работы аптек и передаёт вопросы по применению препаратов фармацевту.",
        "scene": {
            "title": "Наличие в аптеке",
            "input": "Товар и филиал",
            "output": "Наличие и статус"
        },
        "alt": "ИИ-агент для направления «Аптечным сетям»: наличие в аптеке",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/pharmacy-chains.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/pharmacy-chains.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "medical-laboratories",
        "label": "Медицинским лабораториям",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Посетители путаются в адресах, времени сдачи и выданных инструкциях.",
        "workflow": [
            "Уточняет назначенное исследование и филиал",
            "Показывает утверждённую инструкцию",
            "Сообщает доступный статус без интерпретации результатов"
        ],
        "outcome": "Понятная организационная информация до и после сдачи анализа.",
        "example": "Помогает найти филиал, время сдачи и утверждённую инструкцию подготовки к назначенному анализу, сообщает статус готовности исследования.",
        "scene": {
            "title": "Подготовка к анализу",
            "input": "Исследование и филиал",
            "output": "Инструкция подготовки"
        },
        "alt": "ИИ-агент для направления «Медицинским лабораториям»: подготовка к анализу",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/medical-laboratories.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/medical-laboratories.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "beauty-salons",
        "label": "Салонам красоты",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Запись и переносы требуют постоянного внимания администратора.",
        "workflow": [
            "Уточняет услугу, мастера и время",
            "Проверяет доступные интервалы",
            "Подтверждает запись и согласованные напоминания"
        ],
        "outcome": "Удобная запись с актуальными данными для клиента и мастера.",
        "example": "Уточняет услугу и пожелания клиента, подбирает свободное время у мастера и отправляет согласованные напоминания о записи.",
        "scene": {
            "title": "Запись к мастеру",
            "input": "Услуга и пожелания",
            "output": "Свободное время"
        },
        "alt": "ИИ-агент для направления «Салонам красоты»: запись к мастеру",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/beauty-salons.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/beauty-salons.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "barbershops",
        "label": "Барбершопам",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Администратор отвечает на одинаковые вопросы и вручную переносит визиты.",
        "workflow": [
            "Находит услугу и мастера",
            "Согласует доступное время",
            "Обновляет подтверждённую запись"
        ],
        "outcome": "Актуальное расписание и понятные условия визита для клиента.",
        "example": "Записывает клиента к выбранному мастеру, помогает перенести визит и отвечает по услугам и действующему прайсу.",
        "scene": {
            "title": "Перенос визита",
            "input": "Мастер и запись",
            "output": "Обновлённое время"
        },
        "alt": "ИИ-агент для направления «Барбершопам»: перенос визита",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/barbershops.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/barbershops.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "cosmetology-clinics",
        "label": "Косметологиям",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Первичные вопросы смешивают запись, описание услуг и запросы к специалисту.",
        "workflow": [
            "Уточняет цель обращения",
            "Даёт утверждённую организационную информацию",
            "Передаёт индивидуальные вопросы специалисту"
        ],
        "outcome": "Подготовленная консультация с сохранёнными вопросами клиента.",
        "example": "Отвечает по организации консультации и утверждённым описаниям услуг, фиксирует вопросы клиента и передаёт их специалисту перед приёмом.",
        "scene": {
            "title": "Вопросы косметологу",
            "input": "Вопросы клиента",
            "output": "Бриф консультации"
        },
        "alt": "ИИ-агент для направления «Косметологиям»: вопросы косметологу",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/cosmetology-clinics.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/cosmetology-clinics.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "fitness-clubs",
        "label": "Фитнес-клубам",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Потенциальным клиентам сложно сравнить абонементы и расписание.",
        "workflow": [
            "Уточняет предпочтения по формату занятий",
            "Показывает условия из каталога клуба",
            "Оформляет заявку на пробный визит"
        ],
        "outcome": "Подходящие варианты для обсуждения с менеджером и понятная запись.",
        "example": "Подбирает варианты абонементов и занятий из каталога клуба, отвечает по расписанию и оформляет заявку на пробный визит.",
        "scene": {
            "title": "Выбор абонемента",
            "input": "Цели и расписание",
            "output": "Варианты занятий"
        },
        "alt": "ИИ-агент для направления «Фитнес-клубам»: выбор абонемента",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/fitness-clubs.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/fitness-clubs.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "yoga-studios",
        "label": "Студиям йоги",
        "groupId": "health-beauty",
        "groupLabel": "Здоровье, красота и фитнес",
        "pain": "Клиенты многократно уточняют уровень занятий и свободные места.",
        "workflow": [
            "Собирает пожелания по времени и формату",
            "Показывает занятия по расписанию",
            "Оформляет запись или вопрос преподавателю"
        ],
        "outcome": "Запись на выбранное занятие с понятной организационной информацией.",
        "example": "Помогает найти занятие по расписанию и заявленному уровню, оформляет запись и передаёт индивидуальные вопросы преподавателю.",
        "scene": {
            "title": "Расписание йоги",
            "input": "Время и формат",
            "output": "Запись на занятие"
        },
        "alt": "ИИ-агент для направления «Студиям йоги»: расписание йоги",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/yoga-studios.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/yoga-studios.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "online-schools",
        "label": "Онлайн-школам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Кураторы постоянно отвечают на вопросы, уже разобранные в материалах курса.",
        "workflow": [
            "Уточняет вопрос ученика",
            "Находит ответ с указанием урока",
            "Передаёт нерешённый вопрос куратору"
        ],
        "outcome": "Быстрый доступ к материалам и обращения с контекстом для куратора.",
        "example": "Отвечает ученикам по материалам курса с указанием урока, собирает затруднения и передаёт куратору вопросы вне базы.",
        "scene": {
            "title": "Ответ по курсу",
            "input": "Вопрос ученика",
            "output": "Ответ со ссылкой"
        },
        "alt": "ИИ-агент для направления «Онлайн-школам»: ответ по курсу",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/online-schools.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/online-schools.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "training-centers",
        "label": "Учебным центрам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Заявители не знают, какая программа соответствует их рабочей задаче.",
        "workflow": [
            "Собирает цели и ограничения слушателя",
            "Сопоставляет их с каталогом программ",
            "Передаёт заявку менеджеру обучения"
        ],
        "outcome": "Подборка программ и понятный запрос на обучение.",
        "example": "Сопоставляет цели слушателя с программами из каталога, уточняет условия участия и оформляет заявку на обучение.",
        "scene": {
            "title": "Выбор программы",
            "input": "Цели слушателя",
            "output": "Подборка программ"
        },
        "alt": "ИИ-агент для направления «Учебным центрам»: выбор программы",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/training-centers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/training-centers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "language-schools",
        "label": "Языковым школам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "До вводного занятия администратор долго собирает цели и доступное время.",
        "workflow": [
            "Уточняет цель, формат и расписание",
            "Собирает анкету будущего ученика",
            "Согласует вводную встречу"
        ],
        "outcome": "Подготовленная встреча с контекстом для преподавателя.",
        "example": "Собирает цель и исходные данные ученика, помогает выбрать формат занятий и согласует время вводной встречи.",
        "scene": {
            "title": "Вводный урок",
            "input": "Цель и расписание",
            "output": "Запись на урок"
        },
        "alt": "ИИ-агент для направления «Языковым школам»: вводный урок",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/language-schools.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/language-schools.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "private-tutors",
        "label": "Репетиторам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Подготовка упражнений и разбор повторяющихся ошибок отнимают время преподавателя.",
        "workflow": [
            "Получает материалы и результаты заданий",
            "Выделяет темы для повторения",
            "Готовит упражнения и план на проверку"
        ],
        "outcome": "Заготовки для занятия, адаптированные к материалам преподавателя.",
        "example": "По материалам преподавателя готовит варианты упражнений, фиксирует темы ошибок и собирает план следующего занятия на проверку.",
        "scene": {
            "title": "План занятия",
            "input": "Материалы и задания",
            "output": "Упражнения на проверку"
        },
        "alt": "ИИ-агент для направления «Репетиторам»: план занятия",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/private-tutors.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/private-tutors.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            }
        ]
    },
    {
        "slug": "colleges",
        "label": "Колледжам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Приёмная комиссия повторяет одни и те же правила поступления.",
        "workflow": [
            "Уточняет программу и вопрос абитуриента",
            "Находит утверждённые актуальные сведения",
            "Передаёт нестандартный запрос комиссии"
        ],
        "outcome": "Доступная информация по поступлению и подготовленные обращения.",
        "example": "Помогает абитуриентам найти программы и актуальные требования из утверждённой базы, собирает обращения в приёмную комиссию.",
        "scene": {
            "title": "Поступление в колледж",
            "input": "Вопрос абитуриента",
            "output": "Правила и обращение"
        },
        "alt": "ИИ-агент для направления «Колледжам»: поступление в колледж",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/colleges.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/colleges.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "universities",
        "label": "Университетам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Студенты и сотрудники не находят нужную форму или положение.",
        "workflow": [
            "Уточняет организационный вопрос",
            "Ищет документ в доступной базе",
            "Показывает ответ и ссылку на первоисточник"
        ],
        "outcome": "Навигация по внутренним документам с проверяемыми ссылками.",
        "example": "Находит внутренние положения, формы и учебные материалы, отвечает на организационные вопросы и даёт ссылки на первоисточники.",
        "scene": {
            "title": "Поиск положения",
            "input": "Организационный вопрос",
            "output": "Документ с источником"
        },
        "alt": "ИИ-агент для направления «Университетам»: поиск положения",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/universities.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/universities.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "children-centers",
        "label": "Детским центрам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Родители спрашивают о программах, возрастах и расписании в разных каналах.",
        "workflow": [
            "Уточняет возрастную группу и интерес",
            "Подбирает программы из каталога",
            "Передаёт заявку администратору"
        ],
        "outcome": "Полная заявка на занятие с пожеланиями семьи.",
        "example": "Отвечает родителям по программам и расписанию, уточняет возрастную группу и оформляет заявку администратору.",
        "scene": {
            "title": "Детское занятие",
            "input": "Возраст и интерес",
            "output": "Заявка администратору"
        },
        "alt": "ИИ-агент для направления «Детским центрам»: детское занятие",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/children-centers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/children-centers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "publishers",
        "label": "Издательствам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Несогласованная терминология и редакционные требования обнаруживаются поздно.",
        "workflow": [
            "Читает рукопись и редакционное задание",
            "Сопоставляет термины и структуру",
            "Готовит замечания редактору"
        ],
        "outcome": "Список фрагментов для редакторской проверки до следующей стадии работы.",
        "example": "Проверяет рукопись на соответствие редакционному заданию и терминологии, собирает список несогласованностей и вопросов редактору.",
        "scene": {
            "title": "Проверка рукописи",
            "input": "Рукопись и глоссарий",
            "output": "Замечания редактору"
        },
        "alt": "ИИ-агент для направления «Издательствам»: проверка рукописи",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/publishers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/publishers.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "media-editorial-teams",
        "label": "Редакциям медиа",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Фактура статьи не всегда связана с источниками и нуждается в повторной проверке.",
        "workflow": [
            "Собирает предоставленные источники",
            "Связывает утверждения с подтверждениями",
            "Выделяет неподтверждённые места и вопросы автору"
        ],
        "outcome": "Фактологическая карточка материала с явно обозначенными пробелами.",
        "example": "Собирает из предоставленных источников фактологическую карточку материала, выделяет непроверенные утверждения и готовит вопросы автору.",
        "scene": {
            "title": "Источники материала",
            "input": "Факты и источники",
            "output": "Карточка проверки"
        },
        "alt": "ИИ-агент для направления «Редакциям медиа»: источники материала",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/media-editorial-teams.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/media-editorial-teams.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "libraries",
        "label": "Библиотекам",
        "groupId": "education-media",
        "groupLabel": "Образование и медиа",
        "pain": "Читатели описывают тему, а сотруднику приходится вручную искать в каталоге.",
        "workflow": [
            "Уточняет тему и запрос читателя",
            "Находит подходящие издания в каталоге",
            "Показывает доступность и оформляет обращение"
        ],
        "outcome": "Подборка каталожных записей и подготовленная заявка на обслуживание.",
        "example": "Ищет издания в каталоге по запросу читателя, показывает доступность и помогает оформить заявку на обслуживание.",
        "scene": {
            "title": "Поиск книги",
            "input": "Тема читателя",
            "output": "Каталожная подборка"
        },
        "alt": "ИИ-агент для направления «Библиотекам»: поиск книги",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/libraries.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/libraries.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "restaurants",
        "label": "Ресторанам",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Администратор повторяет меню и условия бронирования во время загрузки зала.",
        "workflow": [
            "Уточняет дату, время и число гостей",
            "Отвечает по утверждённому меню",
            "Передаёт бронь и пожелания администратору"
        ],
        "outcome": "Подготовленное бронирование с сохранёнными пожеланиями гостей.",
        "example": "Отвечает по меню и подтверждённому составу блюд, собирает параметры бронирования стола и передаёт особые пожелания администратору.",
        "scene": {
            "title": "Бронь столика",
            "input": "Дата и гости",
            "output": "Заявка администратору"
        },
        "alt": "ИИ-агент для направления «Ресторанам»: бронь столика",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/restaurants.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/restaurants.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "cafes-coffee-shops",
        "label": "Кафе и кофейням",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Предзаказы и вопросы по меню поступают без полного состава заказа.",
        "workflow": [
            "Уточняет позиции и время получения",
            "Проверяет доступную информацию меню",
            "Отправляет заказ сотруднику на подтверждение"
        ],
        "outcome": "Собранный предзаказ и понятные вопросы для команды кофейни.",
        "example": "Принимает вопросы по меню, наличию и предзаказу, фиксирует состав заказа и отправляет его сотруднику на подтверждение.",
        "scene": {
            "title": "Предзаказ кофе",
            "input": "Меню и пожелания",
            "output": "Заказ на подтверждение"
        },
        "alt": "ИИ-агент для направления «Кафе и кофейням»: предзаказ кофе",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/cafes-coffee-shops.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/cafes-coffee-shops.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "food-delivery",
        "label": "Доставке еды",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Повторные вопросы о заказе перегружают операторов доставки.",
        "workflow": [
            "Уточняет заказ и контакт",
            "Получает доступный статус из системы",
            "Передаёт исключения оператору"
        ],
        "outcome": "Клиент видит статус, оператор получает обращения с контекстом.",
        "example": "Уточняет заказ, адрес и пожелания, сообщает статус из системы и передаёт спорные ситуации оператору.",
        "scene": {
            "title": "Доставка заказа",
            "input": "Заказ и адрес",
            "output": "Статус клиенту"
        },
        "alt": "ИИ-агент для направления «Доставке еды»: доставка заказа",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/food-delivery.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/food-delivery.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "catering-companies",
        "label": "Кейтерингу",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Для расчёта мероприятия не хватает данных о гостях, формате и меню.",
        "workflow": [
            "Собирает параметры мероприятия",
            "Подбирает варианты по утверждённому меню",
            "Готовит бриф и черновик предложения"
        ],
        "outcome": "Полные исходные данные для расчёта и согласования кейтеринга.",
        "example": "Собирает число гостей, формат и ограничения мероприятия, готовит бриф и черновик предложения на основе утверждённого меню.",
        "scene": {
            "title": "Бриф банкета",
            "input": "Гости и формат",
            "output": "Меню и предложение"
        },
        "alt": "ИИ-агент для направления «Кейтерингу»: бриф банкета",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/catering-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/catering-companies.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "hotels",
        "label": "Отелям",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Гости повторно уточняют правила, услуги и условия заезда.",
        "workflow": [
            "Определяет вопрос и даты проживания",
            "Находит правила и доступность в системах",
            "Передаёт пожелания службе размещения"
        ],
        "outcome": "Подготовленное обращение и актуальная организационная информация для гостя.",
        "example": "Отвечает по услугам и правилам проживания, проверяет доступность через систему бронирования и передаёт пожелания гостя службе размещения.",
        "scene": {
            "title": "Пожелания гостя",
            "input": "Бронирование и вопросы",
            "output": "Запрос службе приёма"
        },
        "alt": "ИИ-агент для направления «Отелям»: пожелания гостя",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/hotels.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/hotels.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "glamping-sites",
        "label": "Глэмпингам",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Потенциальные гости не понимают различия объектов и условий проживания.",
        "workflow": [
            "Уточняет даты и состав гостей",
            "Показывает доступные варианты размещения",
            "Разъясняет правила и собирает заявку"
        ],
        "outcome": "Заявка на бронирование с выбранным вариантом и ожиданиями гостя.",
        "example": "Подбирает варианты размещения по датам и составу гостей, разъясняет условия заезда и собирает заявку на бронирование.",
        "scene": {
            "title": "Бронирование домика",
            "input": "Даты и гости",
            "output": "Вариант размещения"
        },
        "alt": "ИИ-агент для направления «Глэмпингам»: бронирование домика",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/glamping-sites.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/glamping-sites.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "tour-operators",
        "label": "Туроператорам",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Партнёры запрашивают одни и те же программы и условия в переписке.",
        "workflow": [
            "Находит актуальную программу в базе",
            "Отвечает по утверждённым условиям",
            "Собирает запрос партнёра на расчёт"
        ],
        "outcome": "Единый доступ партнёров к информации и подготовленные запросы менеджерам.",
        "example": "Собирает программы и условия туров в единую базу, помогает партнёрам найти актуальную информацию и оформить запрос на расчёт.",
        "scene": {
            "title": "Программа тура",
            "input": "Запрос партнёра",
            "output": "Программа и расчёт"
        },
        "alt": "ИИ-агент для направления «Туроператорам»: программа тура",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/tour-operators.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/tour-operators.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "travel-agencies",
        "label": "Турагентствам",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Менеджер тратит первый разговор на сбор дат, бюджета и предпочтений.",
        "workflow": [
            "Собирает исходные параметры поездки",
            "Находит предложения в подключённых источниках",
            "Готовит бриф и подборку менеджеру"
        ],
        "outcome": "Подготовленный запрос для дальнейшего подбора и проверки тура.",
        "example": "Уточняет бюджет, даты и предпочтения путешественника, формирует бриф для менеджера и готовит подборку из подключённых предложений.",
        "scene": {
            "title": "Бриф путешествия",
            "input": "Даты и предпочтения",
            "output": "Подборка менеджеру"
        },
        "alt": "ИИ-агент для направления «Турагентствам»: бриф путешествия",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/travel-agencies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/travel-agencies.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "tour-guides-bureaus",
        "label": "Экскурсионным бюро",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Пожелания группы и ограничения маршрута уточняются в длинной переписке.",
        "workflow": [
            "Уточняет интересы, длительность и состав группы",
            "Подбирает экскурсии по доступному расписанию",
            "Передаёт заявку гиду или менеджеру"
        ],
        "outcome": "Согласуемая подборка и контекст будущей экскурсии.",
        "example": "Подбирает экскурсии по интересам, длительности и доступным датам, собирает состав группы и оформляет заявку гиду.",
        "scene": {
            "title": "Подбор экскурсии",
            "input": "Интересы группы",
            "output": "Маршрут и заявка"
        },
        "alt": "ИИ-агент для направления «Экскурсионным бюро»: подбор экскурсии",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/tour-guides-bureaus.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/tour-guides-bureaus.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "conference-venues",
        "label": "Конференц-площадкам",
        "groupId": "hospitality-tourism",
        "groupLabel": "Гостеприимство и туризм",
        "pain": "Заявки на мероприятие не содержат требований к залам и оборудованию.",
        "workflow": [
            "Собирает формат, участников и дату",
            "Подбирает помещения по параметрам",
            "Готовит бриф для менеджера площадки"
        ],
        "outcome": "Подготовленная заявка на площадку с техническими требованиями.",
        "example": "Уточняет формат события, число участников и требования к оборудованию, подбирает помещения и готовит заявку менеджеру.",
        "scene": {
            "title": "Подбор площадки",
            "input": "Гости и оборудование",
            "output": "Залы для просмотра"
        },
        "alt": "ИИ-агент для направления «Конференц-площадкам»: подбор площадки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/conference-venues.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/conference-venues.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "saas-companies",
        "label": "SaaS-компаниям",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "В поддержку поступают повторяющиеся вопросы и неполные сообщения об ошибках.",
        "workflow": [
            "Ищет ответ в документации продукта",
            "Уточняет шаги и данные проблемы",
            "Формирует обращение в поддержку"
        ],
        "outcome": "Проверяемая справка по продукту или полноценный запрос инженерам.",
        "example": "Отвечает по документации продукта, собирает воспроизводимые шаги проблемы и передаёт подготовленный запрос в поддержку.",
        "scene": {
            "title": "Вопрос о продукте",
            "input": "Вопрос и документация",
            "output": "Ответ или тикет"
        },
        "alt": "ИИ-агент для направления «SaaS-компаниям»: вопрос о продукте",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/saas-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/saas-companies.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "web-studios",
        "label": "Веб-студиям",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "Клиентский бриф не раскрывает ограничения и спорные требования проекта.",
        "workflow": [
            "Разбирает бриф и исходные материалы",
            "Выделяет противоречия и открытые вопросы",
            "Готовит структуру задач для оценки"
        ],
        "outcome": "Материалы для обсуждения объёма проекта до расчёта работ.",
        "example": "Собирает требования клиента, находит противоречия в брифе и готовит структуру задач и вопросов для оценки проекта.",
        "scene": {
            "title": "Бриф сайта",
            "input": "Требования клиента",
            "output": "Структура задач"
        },
        "alt": "ИИ-агент для направления «Веб-студиям»: бриф сайта",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/web-studios.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/web-studios.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "crm-integrators",
        "label": "Интеграторам CRM",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "Процесс клиента описан устно и не совпадает с фактическими настройками CRM.",
        "workflow": [
            "Структурирует интервью и доступные настройки",
            "Сопоставляет этапы процесса с системой",
            "Готовит список изменений на согласование"
        ],
        "outcome": "Зафиксированный процесс и обсуждаемый план настройки CRM.",
        "example": "Документирует текущий процесс продаж из интервью, сопоставляет его с настройками CRM и готовит список изменений для согласования.",
        "scene": {
            "title": "Настройка воронки",
            "input": "Процесс и настройки",
            "output": "План изменений"
        },
        "alt": "ИИ-агент для направления «Интеграторам CRM»: настройка воронки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/crm-integrators.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/crm-integrators.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "it-outsourcing",
        "label": "IT-аутсорсингу",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "Инженеры получают обращения без технических данных и истории действий.",
        "workflow": [
            "Уточняет устройство и описание проблемы",
            "Ищет подходящую внутреннюю инструкцию",
            "Создаёт заявку с собранными данными"
        ],
        "outcome": "Подготовленная заявка и найденные материалы для инженера.",
        "example": "Классифицирует обращения по обслуживанию, ищет инструкции в базе и создаёт инженеру заявку с собранными техническими данными.",
        "scene": {
            "title": "Заявка инженеру",
            "input": "Проблема и устройство",
            "output": "Технические данные"
        },
        "alt": "ИИ-агент для направления «IT-аутсорсингу»: заявка инженеру",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/it-outsourcing.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/it-outsourcing.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "support-centers",
        "label": "Центрам поддержки",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "Оператору нужно быстро найти правильный ответ и учесть историю обращения.",
        "workflow": [
            "Читает доступный контекст обращения",
            "Находит релевантные инструкции",
            "Предлагает ответ и путь эскалации"
        ],
        "outcome": "Черновик ответа с источниками для проверки оператором.",
        "example": "Готовит оператору ответ на основе базы знаний и истории обращения, показывает источники и рекомендует маршрут эскалации.",
        "scene": {
            "title": "Ответ оператора",
            "input": "Обращение и история",
            "output": "Черновик с источниками"
        },
        "alt": "ИИ-агент для направления «Центрам поддержки»: ответ оператора",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/support-centers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/support-centers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "translation-agencies",
        "label": "Агентствам перевода",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "Переводы расходятся с глоссарием, а неоднозначные фрагменты сложно отслеживать.",
        "workflow": [
            "Принимает текст и утверждённый глоссарий",
            "Готовит черновик с едиными терминами",
            "Отмечает неоднозначности переводчику"
        ],
        "outcome": "Редактируемый черновик и перечень мест для профессиональной проверки.",
        "example": "Подготавливает черновик перевода с корпоративным глоссарием и выделяет термины и фрагменты для проверки переводчиком.",
        "scene": {
            "title": "Черновик перевода",
            "input": "Текст и глоссарий",
            "output": "Перевод на проверку"
        },
        "alt": "ИИ-агент для направления «Агентствам перевода»: черновик перевода",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/translation-agencies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/translation-agencies.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "research-firms",
        "label": "Исследовательским бюро",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "Качественные интервью долго кодировать и связывать с итоговыми наблюдениями.",
        "workflow": [
            "Получает интервью и согласованную схему кодирования",
            "Группирует фрагменты по темам",
            "Связывает наблюдения с исходными цитатами"
        ],
        "outcome": "Проверяемая заготовка анализа для исследовательской команды.",
        "example": "Кодирует интервью по согласованной схеме, группирует наблюдения и связывает выводы с исходными цитатами для проверки аналитиком.",
        "scene": {
            "title": "Темы интервью",
            "input": "Интервью и схема",
            "output": "Наблюдения с цитатами"
        },
        "alt": "ИИ-агент для направления «Исследовательским бюро»: темы интервью",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/research-firms.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/research-firms.svg",
        "links": [
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            }
        ]
    },
    {
        "slug": "consulting-companies",
        "label": "Консалтинговым компаниям",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "Полезные материалы прошлых проектов сложно найти для нового предложения.",
        "workflow": [
            "Уточняет задачу нового клиента",
            "Ищет разрешённые материалы в архиве",
            "Готовит структуру и черновик предложения"
        ],
        "outcome": "Подборка релевантного опыта и заготовка клиентского предложения.",
        "example": "Находит релевантные материалы в архиве проектов и собирает черновик предложения с учётом нового клиентского запроса.",
        "scene": {
            "title": "Материалы предложения",
            "input": "Запрос и архив",
            "output": "Черновик предложения"
        },
        "alt": "ИИ-агент для направления «Консалтинговым компаниям»: материалы предложения",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/consulting-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/consulting-companies.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            }
        ]
    },
    {
        "slug": "tender-teams",
        "label": "Тендерным отделам",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "Требования и сроки закупки разбросаны по большому комплекту документов.",
        "workflow": [
            "Извлекает условия и контрольные даты",
            "Собирает перечень необходимых материалов",
            "Отмечает недостающее для команды заявки"
        ],
        "outcome": "Проверяемый контрольный список подготовки тендерной заявки.",
        "example": "Извлекает требования и сроки из закупочной документации, формирует контрольный список и отмечает недостающие материалы заявки.",
        "scene": {
            "title": "Пакет тендера",
            "input": "Требования закупки",
            "output": "Контрольный список"
        },
        "alt": "ИИ-агент для направления «Тендерным отделам»: пакет тендера",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/tender-teams.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/tender-teams.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "b2b-sales-teams",
        "label": "B2B-отделам продаж",
        "groupId": "it-b2b",
        "groupLabel": "IT и профессиональные услуги",
        "pain": "После звонков данные сделки и договорённости остаются в заметках менеджера.",
        "workflow": [
            "Разбирает согласованную запись разговора",
            "Структурирует потребности и следующие действия",
            "Готовит обновление CRM и письмо на подтверждение"
        ],
        "outcome": "Актуальная карточка сделки и согласованный следующий шаг.",
        "example": "После звонка заполняет карточку сделки, выделяет потребности и договорённости и готовит письмо с дальнейшими шагами на согласование менеджером.",
        "scene": {
            "title": "Итоги звонка",
            "input": "Звонок и сделка",
            "output": "CRM и следующие шаги"
        },
        "alt": "ИИ-агент для направления «B2B-отделам продаж»: итоги звонка",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/b2b-sales-teams.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/b2b-sales-teams.svg",
        "links": [
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "farms",
        "label": "Фермерским хозяйствам",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Оптовые запросы приходят без объёма, упаковки и срока поставки.",
        "workflow": [
            "Уточняет продукт и объём",
            "Собирает требования к поставке",
            "Передаёт заявку ответственному за сбыт"
        ],
        "outcome": "Подготовленный заказ для расчёта и подтверждения хозяйством.",
        "example": "Принимает оптовые запросы по урожаю или продукции, уточняет объём и сроки и готовит заявку ответственному за сбыт.",
        "scene": {
            "title": "Заказ урожая",
            "input": "Продукт и объём",
            "output": "Заявка на поставку"
        },
        "alt": "ИИ-агент для направления «Фермерским хозяйствам»: заказ урожая",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/farms.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/farms.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "agricultural-holdings",
        "label": "Агрохолдингам",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Отчётность подразделений трудно свести по единым управленческим показателям.",
        "workflow": [
            "Принимает выбранные отчёты подразделений",
            "Приводит записи к согласованной схеме",
            "Выделяет пропуски и готовит сводку"
        ],
        "outcome": "Единый обзор данных с вопросами для ответственных подразделений.",
        "example": "Сводит производственные сообщения подразделений, находит пропуски в отчётности и готовит управленческую сводку по заданным показателям.",
        "scene": {
            "title": "Отчёт хозяйств",
            "input": "Отчёты подразделений",
            "output": "Управленческая сводка"
        },
        "alt": "ИИ-агент для направления «Агрохолдингам»: отчёт хозяйств",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/agricultural-holdings.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/agricultural-holdings.svg",
        "links": [
            {
                "title": "Внедрение ИИ в бизнес-процессы",
                "href": "/services/ai-integration"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "garden-centers",
        "label": "Садовым центрам",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Клиенты выбирают растения без описания условий участка и своих требований.",
        "workflow": [
            "Уточняет условия и пожелания покупателя",
            "Подбирает позиции по данным каталога",
            "Передаёт вопросы и подборку консультанту"
        ],
        "outcome": "Подготовленная консультация с учётом параметров участка.",
        "example": "Подбирает позиции по каталогу и заданным условиям участка, объясняет утверждённые рекомендации по уходу и формирует заявку консультанту.",
        "scene": {
            "title": "Подбор растений",
            "input": "Условия участка",
            "output": "Подборка консультанту"
        },
        "alt": "ИИ-агент для направления «Садовым центрам»: подбор растений",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/garden-centers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/garden-centers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "cleaning-companies",
        "label": "Клининговым компаниям",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Запросы на уборку поступают без площади, состава работ и состояния объекта.",
        "workflow": [
            "Уточняет параметры помещения",
            "Собирает фотографии и пожелания",
            "Формирует заявку на расчёт или осмотр"
        ],
        "outcome": "Бриф уборки с данными, нужными менеджеру и исполнителю.",
        "example": "Уточняет площадь, тип объекта и состав работ, собирает фотографии и оформляет заявку на расчёт или осмотр.",
        "scene": {
            "title": "Расчёт уборки",
            "input": "Объект и работы",
            "output": "Заявка на оценку"
        },
        "alt": "ИИ-агент для направления «Клининговым компаниям»: расчёт уборки",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/cleaning-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/cleaning-companies.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "home-repair-services",
        "label": "Бытовым сервисам",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Мастер получает заявку без модели техники и понятного описания проблемы.",
        "workflow": [
            "Уточняет технику и описание поломки",
            "Собирает адрес и удобное время",
            "Передаёт структурированную заявку мастеру"
        ],
        "outcome": "Подготовленный выезд с основными исходными сведениями.",
        "example": "Собирает описание поломки, модель техники и адрес, уточняет удобное время и передаёт мастеру структурированную заявку.",
        "scene": {
            "title": "Вызов мастера",
            "input": "Техника и проблема",
            "output": "Заявка на выезд"
        },
        "alt": "ИИ-агент для направления «Бытовым сервисам»: вызов мастера",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/home-repair-services.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/home-repair-services.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "dry-cleaners",
        "label": "Химчисткам",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Клиенту непонятно, какие данные об изделии нужны для приёма заказа.",
        "workflow": [
            "Уточняет вид изделия и запрос",
            "Показывает утверждённые условия приёма",
            "Создаёт заявку на консультацию или забор"
        ],
        "outcome": "Понятная передача заказа и сохранённые вопросы клиента.",
        "example": "Уточняет тип изделий и требуемую услугу, сообщает условия приёма и создаёт заявку на консультацию или забор заказа.",
        "scene": {
            "title": "Приём вещей",
            "input": "Изделие и услуга",
            "output": "Заявка на приём"
        },
        "alt": "ИИ-агент для направления «Химчисткам»: приём вещей",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/dry-cleaners.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/dry-cleaners.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    },
    {
        "slug": "security-companies",
        "label": "Охранным предприятиям",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Для подготовки предложения не хватает сведений об объекте и режиме работы.",
        "workflow": [
            "Собирает параметры объекта",
            "Уточняет требования заказчика",
            "Готовит бриф обследования и комплект документов"
        ],
        "outcome": "Исходные материалы для оценки объекта профильным специалистом.",
        "example": "Собирает параметры объекта и требования заказчика, формирует бриф для обследования и комплект документов для коммерческого предложения.",
        "scene": {
            "title": "Обследование объекта",
            "input": "Объект и требования",
            "output": "Бриф специалисту"
        },
        "alt": "ИИ-агент для направления «Охранным предприятиям»: обследование объекта",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/security-companies.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/security-companies.svg",
        "links": [
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "charitable-foundations",
        "label": "Благотворительным фондам",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Обращения поступают в разном виде и требуют повторного сбора сведений.",
        "workflow": [
            "Принимает обращение по правилам фонда",
            "Проверяет комплектность необходимых сведений",
            "Маршрутизирует запрос ответственному сотруднику"
        ],
        "outcome": "Организованная очередь обращений с сохранённым контекстом.",
        "example": "Классифицирует обращения, проверяет полноту предоставленных сведений и направляет их сотрудникам по утверждённым правилам фонда.",
        "scene": {
            "title": "Маршрут обращения",
            "input": "Заявление и сведения",
            "output": "Передача сотруднику"
        },
        "alt": "ИИ-агент для направления «Благотворительным фондам»: маршрут обращения",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/charitable-foundations.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/charitable-foundations.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "sports-federations",
        "label": "Спортивным федерациям",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Организаторы повторяют правила и вручную проверяют комплектность заявок.",
        "workflow": [
            "Отвечает по утверждённому регламенту",
            "Собирает заявку участника",
            "Отмечает недостающие документы организатору"
        ],
        "outcome": "Подготовленные заявки и доступная участникам информация о соревновании.",
        "example": "Отвечает по регламентам соревнований, собирает заявки участников и отмечает недостающие документы для организаторов.",
        "scene": {
            "title": "Заявка спортсмена",
            "input": "Заявка и регламент",
            "output": "Пакет организатору"
        },
        "alt": "ИИ-агент для направления «Спортивным федерациям»: заявка спортсмена",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/sports-federations.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/sports-federations.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            },
            {
                "title": "Архитектура ИИ-систем",
                "href": "/services/ai-solution-architecture"
            }
        ]
    },
    {
        "slug": "utility-providers",
        "label": "Ресурсоснабжающим компаниям",
        "groupId": "local-community",
        "groupLabel": "Локальные услуги и другие отрасли",
        "pain": "Обращения абонентов попадают не в то подразделение и требуют уточнений.",
        "workflow": [
            "Уточняет категорию и данные обращения",
            "Связывает запрос с доступной учётной записью",
            "Создаёт заявку профильному подразделению"
        ],
        "outcome": "Полная карточка обращения с понятным маршрутом обработки.",
        "example": "Принимает обращения по услугам, уточняет адрес и лицевой счёт через предусмотренный процесс и направляет заявку в нужное подразделение.",
        "scene": {
            "title": "Обращение абонента",
            "input": "Адрес и запрос",
            "output": "Заявка подразделению"
        },
        "alt": "ИИ-агент для направления «Ресурсоснабжающим компаниям»: обращение абонента",
        "icon": "/images/aicraft-audience-assets-120/icons/svg/utility-providers.svg",
        "illustration": "/images/aicraft-audience-assets-120/dark/illustrations/utility-providers.svg",
        "links": [
            {
                "title": "ИИ-ассистенты и чат-боты",
                "href": "/services/ai-assistants-chatbots"
            },
            {
                "title": "Интеграция с 1С и CRM",
                "href": "/services/ai-integration-1c-crm"
            },
            {
                "title": "Разработка ИИ-агентов",
                "href": "/ai-agents"
            }
        ]
    }
];

export const AUDIENCE_COUNT = AUDIENCES.length;
