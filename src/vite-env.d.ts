/**

* Este arquivo serve para informar ao TypeScript
* sobre tipos adicionais que não vêm por padrão.
*
* Em projetos com Vite e PWA, alguns módulos são
* "virtuais" — ou seja, não existem fisicamente
* como arquivos no projeto, mas são gerados
* automaticamente pelo build.
*
* Sem essas referências, o TypeScript não reconhece
* esses módulos e mostra erro no editor.
  */

/**

* Tipos padrão do Vite
*
* Permite usar:
* * import.meta.env (variáveis de ambiente)
* * funcionalidades específicas do Vite
    */
    /// <reference types="vite/client" />

/**

* Tipos do plugin de PWA (vite-plugin-pwa)
*
* Necessário para que o TypeScript reconheça
* módulos como:
*
* import { registerSW } from "virtual:pwa-register"
*
* Sem isso, aparece o erro:
* "Cannot find module 'virtual:pwa-register'"
  */
  /// <reference types="vite-plugin-pwa/client" />


/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
