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
 */
function replaceSection(content, startMarker, endMarker, newContent) {
  const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, "m");

  return content.replace(regex, `${startMarker}\n${newContent}\n${endMarker}`);
}

/**
 * Sincroniza automaticamente o README.
 */
export function updateReadme(version) {
  const readmePath = path.join(process.cwd(), "README.md");

  // Lê todo o conteúdo do README
  let content = fs.readFileSync(readmePath, "utf8");

  // Atualiza apenas a seção da versão
  content = replaceSection(
    content,
    "<!-- VERSION:START -->",
    "<!-- VERSION:END -->",
    `Versão atual: **${version}**`,
  );

  // Salva novamente o arquivo
  fs.writeFileSync(readmePath, content);

  console.log("📘 README sincronizado.");
}
