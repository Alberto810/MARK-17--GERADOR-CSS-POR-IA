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






