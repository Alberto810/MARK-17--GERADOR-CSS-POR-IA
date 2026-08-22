import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GROQ_API_KEY;

function limparCodigo(texto) {
    return texto
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();
}

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido." });
    }

    const { input } = req.body;

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
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "system",
                        content: `Você é um gerador de HTML + CSS + JavaScript.

Regras:
1. Não dê explicações sobre o código.
2. Retorne somente o código.
3. Gere primeiro o HTML.
4. Depois o CSS.
5. Se necessário, inclua JavaScript.
6. Inclua <style> dentro do HTML.
7. Se JavaScript for necessário, inclua <script>.
8. O código deve ser bem formatado.
9. O código deve ser leve e otimizado.
10. Siga exatamente o pedido do usuário.
11. Se o pedido for genérico, seja criativo.
12. Crie interfaces modernas, funcionais e responsivas.

                        `,
                    },
                    {
                        role: "user",
                        content: input,
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        const bruto = data.choices?.[0]?.message?.content || "";
        const codigo = limparCodigo(bruto);

        return res.json({ codigo, bruto });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}