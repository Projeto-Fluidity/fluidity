import { Link, useLocation } from "react-router-dom";

/**
 * Barra de navegação inferior da aplicação.
 */
export default function BottomNav() {
  const location = useLocation();

  const linkClass = (path: string) =>
    location.pathname === path
      ? "text-green-600"
      : "text-gray-400";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">

      <Link to="/" className={linkClass("/")}>
        Home
      </Link>

      <Link to="/practices" className={linkClass("/practices")}>
        Práticas
      </Link>

      <Link to="/history" className={linkClass("/history")}>
        Histórico
      </Link>

      <Link to="/profile" className={linkClass("/profile")}>
        Perfil
      </Link>

    </nav>
  );
}
