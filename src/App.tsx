import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

/**
 * Componente raiz da aplicação.
 *
 * Responsável por configurar o roteamento principal
 * utilizando React Router.
 *
 * Atualmente a aplicação possui apenas a rota
 * principal que direciona para o Dashboard.
 *
 * @returns Estrutura de rotas da aplicação
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
