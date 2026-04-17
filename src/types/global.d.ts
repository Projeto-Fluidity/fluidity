/**

* ============================================================
* TIPAGEM GLOBAL DO WINDOW (DEV TOOLS)
* ============================================================
*
* Este arquivo estende a interface global do navegador (window)
* para incluir funções de debug utilizadas durante o desenvolvimento.
*
* CONTEXTO
* Algumas funções de QA/debug são expostas no `window` para facilitar
* testes manuais via DevTools (console do navegador).
*
* Exemplo:
* resetMoodMock()
* resetReminderLogs()
*
* Essas funções NÃO fazem parte da aplicação em produção,
* sendo utilizadas apenas em ambiente de desenvolvimento.
*
* IMPORTANTE
* * As funções são opcionais (uso do "?") porque só existem em DEV
* * Em produção, essas propriedades podem não existir
* * Evita erros de tipagem ao acessar `window` no TypeScript
*
* 🧪 USO NO DEVTOOLS
* Após rodar o projeto em modo DEV:
*
* resetMoodMock()
* resetReminderLogs()
*
* 🔧 ONDE SÃO DEFINIDAS?
* Essas funções são atribuídas no arquivo:
*
* src/main.tsx
*
* Exemplo:
*
* if (import.meta.env.DEV) {
* ```
  window.resetMoodMock = resetMoodMock;
  ```
* ```
  window.resetReminderLogs = resetReminderLogs;
  ```
* }
*
* OBJETIVO
* * Melhorar a experiência de desenvolvimento
* * Facilitar testes de estado (empty, reset, etc)
* * Evitar uso de `any` no TypeScript
    */

export {};

declare global {
interface Window {
/**
* 🧪 Limpa o histórico de humor mockado
* (localStorage)
*/
resetMoodMock?: () => void;

/**
 * 🧪 Reseta os logs de lembretes
 * (mock ou banco, dependendo do ambiente)
 */
  resetReminderLogs?: () => Promise<void>;

  }
}
