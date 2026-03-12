import BottomNav from "../navigation/BottomNav";

type Props = {
  children: React.ReactNode;
};

/**
 * Layout principal da aplicação.
 * Envolve todas as páginas e inclui a navegação inferior.
 */
export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">

      <main className="max-w-md mx-auto p-4">
        {children}
      </main>

      <BottomNav />

    </div>
  );
}
