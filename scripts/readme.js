/**
 * ============================================================================
 * Atualização automática do README
 * ============================================================================
 *
 * Este módulo é responsável EXCLUSIVAMENTE pela sincronização
 * do README.md.
 *
 * Nenhum outro arquivo deve ser atualizado aqui.
 * ============================================================================
 */

import fs from "node:fs";
import path from "node:path";

/**
 * Atualiza uma seção delimitada por marcadores.
 *
 * Exemplo:
 *
 * <!-- VERSION:START -->
 * Conteúdo antigo
 * <!-- VERSION:END -->
 *
 * ↓
 *
 * <!-- VERSION:START -->
 * Conteúdo novo
 * <!-- VERSION:END -->
 */
function replaceSection(content, startMarker, endMarker, newContent) {

  const regex = new RegExp(
    `${startMarker}[\\s\\S]*?${endMarker}`,
    "m"
  );

  return content.replace(
    regex,
    `${startMarker}
${newContent}
${endMarker}`
  );
}

/**
 * Atualiza automaticamente o README.
 */
export function updateReadme(version) {

  const readmePath = path.join(process.cwd(), "README.md");

  let content = fs.readFileSync(readmePath, "utf8");

  /**
   * Primeira sincronização:
   * atualiza apenas a versão do projeto.
   */
  content = replaceSection(
    content,
    "<!-- VERSION:START -->",
    "<!-- VERSION:END -->",
    `Versão atual: **${version}**`
  );

  fs.writeFileSync(readmePath, content);

  console.log("📘 README sincronizado.");
}
