import BottomNav from "../navigation/BottomNav";

/**
 * Layout base da aplicação.
 *
 * Responsável por centralizar o conteúdo
 * e manter consistência visual entre telas.
 */

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen p-6">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}
