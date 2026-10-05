// functions/api/desenho.js
// Pages Function: POST /api/desenho
// Ordem das verificacoes: metodo (405), corpo (400), token (401).

import { gerarDesenho, numeroValido } from "../../lib/desenho.js";

function erro(status, mensagem, cabecalhos = {}) {
  return new Response(JSON.stringify({ erro: mensagem }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cabecalhos },
  });
}

// Devolve o e-mail do token se ele for valido; caso contrario, null.
async function emailDoToken(request, clientId) {
  const autorizacao = request.headers.get("Authorization") || "";
  const partes = autorizacao.match(/^Bearer\s+(\S+)$/i);
  if (!partes || !clientId) return null;

  try {
    const resposta = await fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(partes[1])
    );
    if (resposta.status !== 200) return null;
    const info = await resposta.json();
    if (info.aud !== clientId) return null;
    if (String(info.email_verified) !== "true") return null;
    if (typeof info.email !== "string" || info.email === "") return null;
    return info.email;
  } catch {
    return null;
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return erro(405, "Método não permitido. Use POST.", { Allow: "POST" });
  }

  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return erro(400, "Corpo ausente ou JSON inválido.");
  }
  if (!corpo || typeof corpo !== "object" || !numeroValido(corpo.numero)) {
    return erro(400, "O número deve ser um inteiro entre 1 e 100.");
  }

  const email = await emailDoToken(request, env.GOOGLE_CLIENT_ID);
  if (!email) {
    return erro(401, "Token ausente, inválido ou expirado. Faça login com o Google.");
  }

  return new Response(gerarDesenho(corpo.numero, email), {
    status: 200,
    headers: { "Content-Type": "image/svg+xml" },
  });
}
