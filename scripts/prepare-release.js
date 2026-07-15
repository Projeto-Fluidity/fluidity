/**
 * ============================================================================
 * Fluidity - Preparação de Releases
 * ============================================================================
 *
 * Responsabilidade
 * ----------------
 * Este arquivo é o ponto de entrada da infraestrutura de releases.
 *
 * Ele NÃO modifica diretamente README ou CHANGELOG.
 *
 * Sua única responsabilidade é:
 *
 * ✓ descobrir a versão atual do projeto;
 * ✓ validar a estrutura necessária;
 * ✓ chamar os módulos responsáveis por cada etapa.
 *
 * Isso segue o princípio da Responsabilidade Única (SRP),
 * mantendo o código organizado e de fácil manutenção.
 * ============================================================================
 */

import fs from "node:fs";
import path from "node:path";

import { updateReadme } from "./readme.js";
import { updateChangelog } from "./changelog.js";

/**
 * Diretório raiz do projeto.
 */
const root = process.cwd();

/**
 * Caminhos importantes.
 */
const packageJsonPath = path.join(root, "package.json");
const readmePath = path.join(root, "README.md");
const changelogPath = path.join(root, "CHANGELOG.md");

/**
 * Lê o package.json.
 */
const packageJson = JSON.parse(
  fs.readFileSync(packageJsonPath, "utf8")
);

/**
 * Versão atual do projeto.
 */
const version = packageJson.version;

console.log(`📦 Versão detectada: ${version}`);

/**
 * Valida a estrutura mínima da release.
 */
if (!fs.existsSync(readmePath)) {
  throw new Error("README.md não encontrado.");
}

if (!fs.existsSync(changelogPath)) {
  throw new Error("CHANGELOG.md não encontrado.");
}

console.log("✅ Estrutura validada.");

/**
 * ============================================================================
 * Etapas da preparação da release
 * ============================================================================
 */

updateReadme(version);

updateChangelog(version);

console.log("🚀 Release preparada com sucesso.");
