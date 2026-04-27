const botao = document.querySelector(".botao-gerar");
const endereco = "/api/gerar-css";

botao.addEventListener("click", gerarCodigo);

function cleanCSS(text) {
    if (!text) return "";
    let css = text.trim();
    css = css.replace(/```(?:css)?\s*/g, "");
    css = css.replace(/```\s*$/g, "");
    return css.trim();
}

function buildPreviewHtml(css) {
    const classNames = [];
    const idNames = [];

    for (const match of css.matchAll(/\.([a-zA-Z0-9_-]+)/g)) {
        if (!classNames.includes(match[1])) {
            classNames.push(match[1]);
        }
    }
    for (const match of css.matchAll(/#([a-zA-Z0-9_-]+)/g)) {
        if (!idNames.includes(match[1])) {
            idNames.push(match[1]);
        }
    }

    let previewElement = '<div class="preview" aria-hidden="true"></div>';
    if (classNames.length > 0) {
        const firstClass = classNames[0];
        if (/button|btn|cta/i.test(firstClass)) {
            previewElement = `<button class="${firstClass}" aria-hidden="true"></button>`;
        } else {
            previewElement = `<div class="${firstClass}" aria-hidden="true"></div>`;
        }
    } else if (idNames.length > 0) {
        const firstId = idNames[0];
        if (/button|btn|cta/i.test(firstId)) {
            previewElement = `<button id="${firstId}" aria-hidden="true"></button>`;
        } else {
            previewElement = `<div id="${firstId}" aria-hidden="true"></div>`;
        }
    }

    return `<!DOCTYPE html><html><head><style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
        }
        .preview-wrapper {
            width: 320px;
            height: 320px;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        }
        .preview-wrapper > * {
            width: 100%;
            height: 100%;
            min-width: 120px;
            min-height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        button { border: none; cursor: default; }
    ${css}
    </style></head><body><div class="preview-wrapper">${previewElement}</div></body></html>`;
}

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

    const rawResultado = dados.choices?.[0]?.message?.content || "Nenhum resultado retornado.";
    const resultado = cleanCSS(rawResultado);

    console.log('raw:', rawResultado);
    console.log('clean:', resultado);

    blocoCodigo.textContent = resultado;
    resultadoCodigo.srcdoc = buildPreviewHtml(resultado);
}