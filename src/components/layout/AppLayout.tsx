import type { ReactNode } from "react";
import BottomNav from "../navigation/BottomNav";

type Props = {
  children: ReactNode;
};

/**
 * Layout principal da aplicação.
 * Envolve todas as páginas e inclui a navegação inferior.
 *
 * Estrutura:
 * - Container centralizado na tela
 * - Área principal expansível
 * - BottomNav fixo ao final do layout
 */
export default function AppLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen justify-center">
      <div className="flex min-h-screen w-full max-w-md flex-col">
        <main className="flex flex-1 flex-col">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}