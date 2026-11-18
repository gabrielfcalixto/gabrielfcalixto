// Gera assets/stack.svg: ícones da stack flutuando em onda.
// Uso (Node 18+):  node scripts/gerar-stack.mjs
// Os ícones são baixados do Devicon (https://devicon.dev) e embutidos no SVG,
// porque o GitHub não carrega imagens externas de dentro de um SVG.

import { mkdir, writeFile } from "node:fs/promises";

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const ICONES = [
  ["java", "java-original"],
  ["angular", "angular-original"],
  ["dotnetcore", "dotnetcore-original"],
  ["javascript", "javascript-original"],
  ["react", "react-original"],
  ["docker", "docker-original"],
  ["oracle", "oracle-original"],
  ["mysql", "mysql-original"],
  ["postgresql", "postgresql-original"],
  ["githubactions", "githubactions-original"],
];

const TAMANHO = 48;     // tamanho de cada ícone (px)
const ESPACO = 28;      // espaço entre ícones (px)
const ALTURA_ONDA = 8;  // quanto cada ícone sobe (px)
const DURACAO = 3;      // duração de um ciclo (s)
const ATRASO = 0.18;    // atraso entre um ícone e o próximo (s)

const MARGEM = ALTURA_ONDA + 4;
const largura = ICONES.length * TAMANHO + (ICONES.length - 1) * ESPACO;
const altura = TAMANHO + MARGEM * 2;

// Prefixa ids internos (gradientes etc.) para não colidirem entre ícones.
function isolarIds(svg, prefixo) {
  return svg
    .replace(/\bid="([^"]+)"/g, `id="${prefixo}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefixo}-$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefixo}-$1"`);
}

function aninhar(svg, x, y) {
  const limpo = svg
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
  // Troca/insere posição e tamanho no <svg> raiz do ícone.
  return limpo.replace(/<svg\b([^>]*)>/, (_, attrs) => {
    const semDim = attrs.replace(/\s(width|height|x|y)="[^"]*"/g, "");
    return `<svg${semDim} x="${x}" y="${y}" width="${TAMANHO}" height="${TAMANHO}">`;
  });
}

const grupos = [];
for (const [i, [pasta, arquivo]] of ICONES.entries()) {
  const url = `${CDN}/${pasta}/${arquivo}.svg`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Falha ao baixar ${url} (${resp.status})`);
  const svg = isolarIds(await resp.text(), `i${i}`);
  const x = i * (TAMANHO + ESPACO);
  grupos.push(
    `  <g class="f" style="animation-delay:${(i * ATRASO).toFixed(2)}s">\n    ${aninhar(svg, x, MARGEM)}\n  </g>`
  );
  console.log(`ok  ${pasta}`);
}

const saida = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="Stack">
  <style>
    .f { animation: flutuar ${DURACAO}s ease-in-out infinite; }
    @keyframes flutuar {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-${ALTURA_ONDA}px); }
    }
    @media (prefers-reduced-motion: reduce) { .f { animation: none; } }
  </style>
${grupos.join("\n")}
</svg>
`;

await mkdir("assets", { recursive: true });
await writeFile("assets/stack.svg", saida, "utf8");
console.log(`\nassets/stack.svg gerado (${largura}x${altura})`);
