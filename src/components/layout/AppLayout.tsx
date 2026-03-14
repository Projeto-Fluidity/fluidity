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
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="flex min-h-screen w-full max-w-md flex-col">
        <main className="flex-1">{children}</main>

        <BottomNav />
      </div>
    </div>
  );
}
