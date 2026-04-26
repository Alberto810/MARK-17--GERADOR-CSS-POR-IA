# Gerador CSS por IA

Este projeto é um gerador de código CSS com inteligência artificial. Ele permite que o usuário descreva o estilo desejado em texto e veja o CSS gerado automaticamente, além de um preview simples do resultado.

## Como funciona

- O usuário digita uma descrição visual no campo de texto.
- O frontend envia a requisição para o backend local.
- O backend usa a chave da API hospedada no servidor para chamar a API Groq/OpenAI.
- O backend retorna o CSS gerado ao navegador.
- O frontend exibe o CSS e um preview.

## Arquivos principais

- `index.html` - estrutura da página e área de entrada.
- `styles.css` - estilo da aplicação.
- `scripts.js` - lógica do frontend para chamar o backend e renderizar o resultado.
- `server.js` - backend Express que protege a chave da API e faz a chamada para a API de IA.
- `package.json` - dependências e script de inicialização.
- `.env.example` - exemplo de configuração da chave com variável de ambiente.

## Configuração local

1. Copie `.env.example` para `.env`:

   ```bash
   copy .env.example .env
   ```

2. Abra o arquivo `.env` e insira sua chave:

   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor:

   ```bash
   npm start
   ```

5. Acesse o app em:

   ```
   http://localhost:3000
   ```

## Observações de segurança

- Nunca deixe a chave da API exposta no frontend.
- O arquivo `.env` está listado em `.gitignore` para evitar commit acidental.
- Mantenha apenas `.env.example` no repositório.
