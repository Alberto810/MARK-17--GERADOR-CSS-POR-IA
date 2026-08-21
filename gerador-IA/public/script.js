const botao = document.querySelector(".botao-gerar");
const textarea = document.querySelector(".caixa-texto");
const codigo = document.querySelector(".bloco-codigo");
const iframe = document.querySelector(".resultado-codigo");

botao.addEventListener("click", async () => {
    const prompt = textarea.value;

    if (!prompt) {
        alert("Digite algo!");
        return;
    }

    botao.disabled = true;
    botao.textContent = "Gerando...⚡️";

    try {
        const resposta = await fetch("/api/gerar-css", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: prompt }),
        });

        const data = await resposta.json();

        if (!resposta.ok || data.error) {
            throw new Error(data.error || "Resposta inválida do servidor.");
        }

        codigo.textContent = data.codigo;
        iframe.srcdoc = data.codigo;

    } catch (erro) {
        alert(`Erro: ${erro.message}`);
    }

    botao.disabled = false;
    botao.textContent = "Gerar Código ⚡️";
});

for (let i = 0; i < 1500; i++) {
    const estrela = document.createElement('div');
    estrela.classList.add('estrela');
    estrela.style.top = `${Math.random() * window.innerHeight}px`;
    estrela.style.left = `${Math.random() * window.innerWidth}px`;
    document.body.appendChild(estrela);
}


