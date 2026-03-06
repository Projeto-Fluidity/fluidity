import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuração do Vite para a aplicação.
 *
 * Responsável por configurar o ambiente de desenvolvimento
 * e build do projeto React.
 */
export default defineConfig({
  plugins: [react()],
})
