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

const TAMANHO = 48, ESPACO = 28, ALTURA_ONDA = 8, DURACAO = 3, ATRASO = 0.18;
const MARGEM = ALTURA_ONDA + 4;
const largura = ICONES.length * TAMANHO + (ICONES.length - 1) * ESPACO;
const altura = TAMANHO + MARGEM * 2;

const isolarIds = (svg, p) => svg
  .replace(/\bid="([^"]+)"/g, `id="${p}-$1"`)
  .replace(/url\(#([^)]+)\)/g, `url(#${p}-$1)`)
  .replace(/href="#([^"]+)"/g, `href="#${p}-$1"`);

const aninhar = (svg, x, y) => svg
  .replace(/<\?xml[^>]*\?>/g, "").replace(/<!DOCTYPE[^>]*>/gi, "").replace(/<!--[\s\S]*?-->/g, "").trim()
  .replace(/<svg\b([^>]*)>/, (_, a) =>
    `<svg${a.replace(/\s(width|height|x|y)="[^"]*"/g, "")} x="${x}" y="${y}" width="${TAMANHO}" height="${TAMANHO}">`);

const grupos = [];
for (const [i, [pasta, arquivo]] of ICONES.entries()) {
  const url = `${CDN}/${pasta}/${arquivo}.svg`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Falha ao baixar ${url} (${r.status})`);
  const svg = isolarIds(await r.text(), `i${i}`);
  grupos.push(`  <g class="f" style="animation-delay:${(i * ATRASO).toFixed(2)}s">\n    ${aninhar(svg, i * (TAMANHO + ESPACO), MARGEM)}\n  </g>`);
  console.log(`ok  ${pasta}`);
}

const saida = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="Stack">
  <style>
    .f { animation: flutuar ${DURACAO}s ease-in-out infinite; }
    @keyframes flutuar { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-${ALTURA_ONDA}px); } }
    @media (prefers-reduced-motion: reduce) { .f { animation: none; } }
  </style>
${grupos.join("\n")}
</svg>
`;

await mkdir("assets", { recursive: true });
await writeFile("assets/stack.svg", saida, "utf8");
console.log(`\nassets/stack.svg gerado (${largura}x${altura})`);
