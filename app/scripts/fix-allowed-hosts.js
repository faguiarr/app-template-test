// scripts/fix-vite-allowed-hosts.js
import { existsSync, readFileSync, writeFileSync } from "fs";

const candidates = ["vite.config.ts", "vite.config.js"];
const configPath = candidates.find(f => existsSync(f));

if (!configPath) {
  console.log("ℹ️  Nenhum vite.config.(ts|js) encontrado. Nada a fazer.");
  process.exit(0); // não cria arquivo novo
}

let txt = readFileSync(configPath, "utf8");

// Se já tem allowedHosts, não faz nada
if (/\ballowedHosts\b/.test(txt)) {
  console.log(`✅ ${configPath} já contém allowedHosts. Nada a fazer.`);
  process.exit(0);
}

// snippet a injetar
const INJECT_LINES =
`    // (injetado automaticamente para Replit)
    allowedHosts: ['.repl.co', '.replit.dev', '.worf.replit.dev'],
    host: true,
    hmr: { clientPort: 443 },`;

// Heurística 1: existe "server: {" ? então insere logo após a abertura
const SERVER_OPEN_RE = /server\s*:\s*\{/m;
if (SERVER_OPEN_RE.test(txt)) {
  txt = txt.replace(SERVER_OPEN_RE, (m) => `${m}\n${INJECT_LINES}\n`);
  writeFileSync(configPath, txt, "utf8");
  console.log(`🛠️  Inserido allowedHosts dentro do bloco "server" em ${configPath}.`);
  process.exit(0);
}

// Heurística 2: existe "export default defineConfig({" ? então cria um bloco server lá dentro
const DEFINE_CFG_RE = /export\s+default\s+defineConfig\s*\(\s*\{/m;
if (DEFINE_CFG_RE.test(txt)) {
  txt = txt.replace(DEFINE_CFG_RE, (m) => `${m}\n  server: {\n${INJECT_LINES}\n  },\n`);
  writeFileSync(configPath, txt, "utf8");
  console.log(`🛠️  Adicionado bloco "server" em ${configPath}.`);
  process.exit(0);
}

// Heurística 3: CommonJS "module.exports = defineConfig({"
const DEFINE_CFG_CJS_RE = /module\.exports\s*=\s*defineConfig\s*\(\s*\{/m;
if (DEFINE_CFG_CJS_RE.test(txt)) {
  txt = txt.replace(DEFINE_CFG_CJS_RE, (m) => `${m}\n  server: {\n${INJECT_LINES}\n  },\n`);
  writeFileSync(configPath, txt, "utf8");
  console.log(`🛠️  Adicionado bloco "server" (CJS) em ${configPath}.`);
  process.exit(0);
}

console.log(`⚠️  Não consegui localizar onde injetar em ${configPath}. Revise manualmente o arquivo.`);
process.exit(0);
