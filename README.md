# Desenho Assinado

Página que recebe um número inteiro entre 1 e 100 e devolve uma figura em SVG, assinada com um e-mail.

A figura é a tabuada modular no círculo: 240 pontos igualmente espaçados numa circunferência, com cada ponto `i` ligado ao ponto `(k * i) mod 240`, em que `k = número + 1`. O número 1 produz uma cardioide, o 2 uma nefroide, e cada valor gera uma figura diferente.

## Estrutura

O desenho é gerado no servidor (Cloudflare Pages Functions) e assinado com o e-mail da conta Google usada no login, verificado pelo servidor.

```
public/
  index.html          formulário com o número e o botão de login do Google
  style.css           aparência da página
  script.js           envia número e token para /api/desenho e exibe o SVG
lib/
  desenho.js          gera o SVG (função pura, sem DOM)
functions/api/
  desenho.js          POST /api/desenho (405, 400, 401, 200)
evidencias/
  exemplo.svg         desenho gerado pelo site publicado
```

Variável de ambiente no Cloudflare Pages: `GOOGLE_CLIENT_ID`.

## Publicação no Cloudflare Pages

Framework preset: `None`. Build command: vazio. Build output directory: `public`.

## Identificação (preencha após o fork)

Nome: Emanuell ernesto costa maciel
RA: 2026109125
URL: https://2bim-avalia1-4ui.pages.dev
