const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  console.warn("A variável de ambiente GROQ_API_KEY não está definida. Copie .env.example para .env e configure sua chave.");
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

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
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Você é um assistente de IA especializado em gerar código CSS. Com base na descrição fornecida pelo usuário, você deve criar um código CSS que atenda às especificações. Gere somente o código CSS. Certifique-se de que o código seja limpo, eficiente e fácil de entender."
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

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
