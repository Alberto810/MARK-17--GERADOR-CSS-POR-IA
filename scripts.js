const botao = document.querySelector(".botao-gerar");
const endereco = "/api/gerar-css";

botao.addEventListener("click", gerarCodigo);

async function gerarCodigo() {
    const input = document.querySelector(".input").value.trim();
    const blocoCodigo = document.querySelector(".bloco-codigo");
    const resultadoCodigo = document.querySelector(".resultado-codigo");

    if (!input) {
        blocoCodigo.textContent = "Por favor, descreva a aparência desejada para o CSS.";
        resultadoCodigo.srcdoc = "";
        return;
    }

    const resposta = await fetch(endereco, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
    });

    const dados = await resposta.json();

    if (!resposta.ok || dados.error) {
        blocoCodigo.textContent = `Erro: ${dados.error || 'Resposta inválida do servidor.'}`;
        resultadoCodigo.srcdoc = "";
        return;
    }

    const resultado = dados.choices?.[0]?.message?.content || "Nenhum resultado retornado.";

    console.log(dados);

    blocoCodigo.textContent = resultado;
    resultadoCodigo.srcdoc = `<!DOCTYPE html><html><head><style>${resultado}</style></head><body><div>Preview</div></body></html>`;
}