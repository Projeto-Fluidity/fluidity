import type { ReactNode } from "react";
import BottomNav from "../navigation/BottomNav";

type Props = {
  children: ReactNode;
  hideBottomNav?: boolean;
};

/**
 * Layout principal da aplicação.
 *
 * Responsável por:
 * - centralizar a aplicação na tela
 * - limitar a largura ao tamanho mobile
 * - manter a navegação inferior visível (quando necessário)
 */
export default function AppLayout({ children, hideBottomNav }: Props) {
  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="flex min-h-screen w-full max-w-[390px] flex-col bg-transparent">
        {/* Conteúdo da página */}
        <main className="flex flex-1 flex-col">{children}</main>

        {/* Navegação inferior */}
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}