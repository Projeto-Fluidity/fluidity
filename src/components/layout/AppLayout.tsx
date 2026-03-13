import BottomNav from "../navigation/BottomNav";

type Props = {
  children: React.ReactNode;
};

/**
 * Layout principal da aplicação.
 * Envolve todas as páginas e inclui a navegação inferior.
 * Simula um container mobile centralizado.
 */
export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">

      <div className="w-full max-w-md min-h-screen flex flex-col">

        <main className="flex-1">
          {children}
        </main>

        <BottomNav />

      </div>

    </div>
  );
}
