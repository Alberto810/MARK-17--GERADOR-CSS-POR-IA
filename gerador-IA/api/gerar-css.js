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
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Você é um gerador de HTML + CSS + JavaScript.

Regras:
1. Não precisa dar explicações sobre o código gerado, apenas gere seguindo as regras abaixo.
2. Retorne primeiro o HTML, depois o CSS e se houver, o JavaScript.
3. Inclua <style>, HTML e se necessário, <script>.
4. O código deve sair bem formatado.
5. O código deve ser leve e otimizado.
6. Se o prompt for específico, siga à risca. Se for genérico, use criatividade.
7. Pode usar animações para interatividade, mas sem exageros.
8. Se o prompt for curto, use criatividade para criar algo interessante e moderno.`,
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