import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.GROQ_API_KEY;

app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(express.json());

function limparCodigo(texto) {
    return texto
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post("/api/gerar-css", async (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({ error: "O campo 'input' é obrigatório." });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: "Chave de API não configurada no servidor." });
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
                        content: `
                        Você é um gerador de HTML + CSS + JavaScript.

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

        return res.json({
            codigo,
            bruto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// Para rodar localmente
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

// Necessário para a Vercel
export default app;