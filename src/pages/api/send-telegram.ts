import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        console.log('API Route hit at:', new Date().toISOString());
        
        let textData = '';
        try {
            textData = await request.text();
        } catch (e) {
            console.error('Failed to read request text:', e);
            return new Response(JSON.stringify({ message: 'Ошибка чтения тела запроса' }), { status: 400 });
        }

        console.log('Raw body received:', textData);
        
        let data;
        try {
            data = JSON.parse(textData);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            return new Response(JSON.stringify({ message: 'Некорректный JSON' }), { status: 400 });
        }
        const { fname, phone, email, message, source } = data;

        const token = process.env.PUBLIC_TELEGRAM_BOT_TOKEN || import.meta.env.PUBLIC_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.PUBLIC_TELEGRAM_CHAT_ID || import.meta.env.PUBLIC_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

        console.log('API Request received:', { fname, phone, source });
        console.log('Config check:', { hasToken: !!token, hasChatId: !!chatId });

        if (!token || !chatId) {
            console.error('Telegram Config Missing in API:', { hasToken: !!token, hasChatId: !!chatId });
            return new Response(JSON.stringify({
                message: 'Конфигурация Telegram не найдена на сервере.'
            }), { status: 500 });
        }

        const text = `🚀 Новая заявка с сайта (${source || 'Неизвестно'})\n\n` +
                     `👤 Имя: ${fname}\n` +
                     `📞 Связь: ${phone}\n` +
                     `📧 Email: ${email || 'не указан'}\n` +
                     `📝 Сообщение: ${message || 'без сообщения'}`;

        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            }),
        });

        console.log('Telegram API response status:', response.status);

        if (response.ok) {
            return new Response(JSON.stringify({
                message: 'Сообщение успешно отправлено!'
            }), { status: 200 });
        } else {
            const errorData = await response.json();
            console.error('Telegram API error:', errorData);
            return new Response(JSON.stringify({
                message: `Ошибка Telegram: ${errorData.description || 'Неизвестная ошибка'}`
            }), { status: 500 });
        }
    } catch (error: any) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({
            message: error.message || 'Ошибка сервера при отправке.'
        }), { status: 500 });
    }
};
