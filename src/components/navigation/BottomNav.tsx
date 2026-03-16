import { Home, BarChart3, Calendar, User } from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * Navegação inferior da aplicação.
 * Utilizada em todas as telas principais do sistema.
 */
export default function BottomNav() {
  const baseItemClass =
    "flex flex-col items-center justify-center text-xs transition-colors";

  const activeColor = "text-[#008236]";
  const inactiveColor = "text-[rgba(0,166,62,0.6)]";

  return (
    <nav className="flex h-11 items-center justify-around border-t-2 border-[#B9F8CF] bg-white">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseItemClass} ${isActive ? activeColor : inactiveColor}`
        }
      >
        <Home size={24} />
        Home
      </NavLink>

      <NavLink
        to="/practices"
        className={({ isActive }) =>
          `${baseItemClass} ${isActive ? activeColor : inactiveColor}`
        }
      >
        <BarChart3 size={24} />
        Práticas
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `${baseItemClass} ${isActive ? activeColor : inactiveColor}`
        }
      >
        <Calendar size={24} />
        Histórico
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${baseItemClass} ${isActive ? activeColor : inactiveColor}`
        }
      >
        <User size={24} />
        Perfil
      </NavLink>
    </nav>
  );
}