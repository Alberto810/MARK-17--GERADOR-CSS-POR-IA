export default async function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const cors = require("cors");

    const corsMiddleware = cors();

    module.exports = async (req, res) => {
        await new Promise((resolve, reject) => {
            corsMiddleware(req, res, (result) => {
                if (result instanceof Error) reject(result);
                resolve(result);
            });
        });

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { input } = req.body;
        const API_KEY = process.env.GROQ_API_KEY;

        if (!input) {
            return res.status(400).json({ error: "O campo 'input' é obrigatório." });
        }

        if (!API_KEY) {
            return res.status(500).json({ error: "Chave de API não configurada." });
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `Você é um gerador de HTML + CSS + JavaScript.
Regras:
1. Não precisa dar explicações sobre o código gerado, o porque dele ou o que ele faz, apenas gere o código seguindo as regras abaixo:
2. Retorne primeiro o HTML para que o corpo do que foi pedido seja gerado, depois o CSS e se houver, o JavaScript
3. Inclua <style>, HTML e se necessário, <script>
4. O código deve sair bem formatado
5. O código deve ser leve e otimizado
6. Se o prompt for algo específico, siga à risca o que foi pedido, se for algo genérico, use sua criatividade para criar algo interessante.
7. Pode usar animações para gerar interatividade, mas sem exageros.
8. Se o prompt for curto, como exemplo "bola azul", use sua criatividade para criar algo interessante, moderno e funcional, seguindo as regras acima.        
            `,
                        },
                        { role: "user", content: input },
                    ],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({ error: data });
            }

            const bruto = data.choices?.[0]?.message?.content || "";
            const codigo = bruto.replace(/```html/g, "").replace(/```/g, "").trim();

            return res.json({ codigo, bruto });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}