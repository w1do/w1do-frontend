import AiChat from "./AiChat";

interface ChatWidgetProps {
    title?: string;
}

export default function ChatWidget({ title = "Оставить заявку" }: ChatWidgetProps) {
    return (
        <div className="cta-form-box box-border-gradiant">
            <div className="section-title section-title-center">
                <h2 className="text-anime-style-3" data-cursor="-opaque">{title}</h2>
            </div>
            <AiChat variant="widget" source="chat-widget" />
        </div>
    );
}
