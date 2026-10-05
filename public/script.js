// script.js
// Envia o numero e o id_token do Google para /api/desenho e exibe o SVG.
// O desenho e a assinatura sao gerados no servidor.

// Client ID do OAuth (Web application) criado no Google Cloud Console. E publico.
const CLIENT_ID = "1071673110238-5de0bnvmbmnvavulgpnajm0p5t6cd78v.apps.googleusercontent.com";

const formulario = document.getElementById("formulario");
const campoNumero = document.getElementById("numero");
const area = document.getElementById("desenho");
const mensagem = document.getElementById("mensagem");
const usuario = document.getElementById("usuario");
const botaoBaixar = document.getElementById("baixar");

let idToken = "";
let svgAtual = "";

function iniciarLogin() {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (resposta) => {
      idToken = resposta.credential;
      usuario.textContent = "Login feito. Agora escolha o número e clique em Desenhar.";
      mensagem.textContent = "";
    },
  });
  google.accounts.id.renderButton(document.getElementById("login"), {
    theme: "outline",
    size: "large",
  });
}

if (window.google?.accounts?.id) {
  iniciarLogin();
} else {
  window.onGoogleLibraryLoad = iniciarLogin;
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "";

  const texto = campoNumero.value.trim();
  const numero = texto === "" ? undefined : Number(texto);

  let resposta;
  try {
    resposta = await fetch("/api/desenho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({ numero }),
    });
  } catch {
    mensagem.textContent = "Erro de rede. Tente novamente.";
    return;
  }

  if (resposta.status === 200) {
    svgAtual = await resposta.text();
    area.innerHTML = svgAtual;
    botaoBaixar.hidden = false;
    return;
  }

  area.innerHTML = "";
  botaoBaixar.hidden = true;

  if (resposta.status === 400) {
    mensagem.textContent = "Erro 400: digite um número inteiro entre 1 e 100.";
  } else if (resposta.status === 401) {
    mensagem.textContent = "Erro 401: faça login com o Google (token ausente, inválido ou expirado).";
  } else {
    mensagem.textContent = "Erro " + resposta.status + " ao gerar o desenho.";
  }
});

botaoBaixar.addEventListener("click", () => {
  const arquivo = new Blob([svgAtual], { type: "image/svg+xml" });
  const url = URL.createObjectURL(arquivo);
  const link = document.createElement("a");
  link.href = url;
  link.download = "exemplo.svg";
  link.click();
  URL.revokeObjectURL(url);
});
