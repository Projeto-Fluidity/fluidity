import { Home, BarChart3, Calendar, User } from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * Componente responsável pela navegação inferior da aplicação.
 *
 * A BottomNav fornece acesso rápido às principais seções do sistema:
 *
 * - Home
 * - Práticas
 * - Histórico
 * - Perfil
 *
 * Características de layout:
 * - Barra fixa na base do layout principal
 * - Ícones com labels organizados verticalmente
 * - Destaque visual para a rota ativa
 *
 * Estilização:
 * - Utiliza Tailwind CSS para layout e espaçamento
 * - Ícones provenientes da biblioteca Lucide React
 * - Linha superior verde para reforçar identidade visual
 *
 * Comportamento:
 * - Utiliza `NavLink` do React Router para controlar o estado ativo
 * - A rota ativa recebe destaque automático
 */
export default function BottomNav() {
  /**
   * Classe base aplicada a todos os itens da navegação.
   */
  const baseItemClass =
    "flex flex-col items-center justify-center text-xs transition-colors";

  return (
    <nav className="border-t-2 border-[#B9F8CF] bg-white h-11 flex justify-around items-center">

      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseItemClass} ${
            isActive ? "text-[#008236]" : "text-gray-400"
          }`
        }
      >
        <Home size={20} />
        Home
      </NavLink>

      {/* Práticas */}
      <NavLink
        to="/practices"
        className={({ isActive }) =>
          `${baseItemClass} ${
            isActive ? "text-[#008236]" : "text-gray-400"
          }`
        }
      >
        <BarChart3 size={20} />
        Práticas
      </NavLink>

      {/* Histórico */}
      <NavLink
        to="/history"
        className={({ isActive }) =>
          `${baseItemClass} ${
            isActive ? "text-[#008236]" : "text-gray-400"
          }`
        }
      >
        <Calendar size={20} />
        Histórico
      </NavLink>

      {/* Perfil */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${baseItemClass} ${
            isActive ? "text-[#008236]" : "text-gray-400"
          }`
        }
      >
        <User size={20} />
        Perfil
      </NavLink>

    </nav>
  );
}

