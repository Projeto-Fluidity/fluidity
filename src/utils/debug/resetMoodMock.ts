/**

* 🧪 Reset do mock de humor (ambiente de desenvolvimento)
*
* Esta função é utilizada para limpar os dados mockados de humor
* armazenados no localStorage do navegador.
*
* CONTEXTO
* O projeto possui um modo de execução com dados simulados (mock),
* ativado pela variável de ambiente:
*
* VITE_USE_MOCK=true
*
* Nesse modo, os registros de humor não vêm do backend (Supabase),
* mas sim do localStorage.
*
* ONDE OS DADOS FICAM?
* Os dados são salvos na chave:
*
* fluidity:mood_mock
*
* O QUE ESTA FUNÇÃO FAZ?
* * Remove todos os registros mockados do localStorage
* * Faz com que a aplicação volte ao estado "sem histórico"
*
* 🧪 QUANDO USAR?
* * Testar o estado vazio (empty state)
* * Resetar dados durante desenvolvimento
* * Validar fluxos do QA
*
*  COMO USAR?
* No console do navegador (DevTools):
*
* resetMoodMock()
*
* Após executar, recarregue a página para ver o efeito.
*
* IMPORTANTE
* * Esta função só deve ser usada em ambiente de desenvolvimento
* * Não afeta dados reais do banco (Supabase)
* * Não deve ser utilizada em produção
    */

const STORAGE_KEY = "fluidity:mood_mock";

/**

* Remove os dados mockados de humor do localStorage.
  */
  export function resetMoodMock() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  console.log("🧪 Mock de humor resetado");
  }
