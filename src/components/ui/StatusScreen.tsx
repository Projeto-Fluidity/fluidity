import type { ReactNode } from "react";
import AppLayout from "../layout/AppLayout";

interface StatusScreenProps {
  icon: ReactNode;
  title: string;
  descriptionPrimary?: ReactNode;
  descriptionSecondary?: ReactNode;
  errorCard?: ReactNode;
  action?: ReactNode;
  footer?: string;
  hideBottomNav?: boolean;
}

/**

* Layout reutilizável para telas de status
* como sucesso, erro ou estados vazios.
*
* Por padrão utiliza o AppLayout (com BottomNav).
* Pode opcionalmente ocultar o BottomNav.
  */
export default function StatusScreen({
  icon,
  title,
  descriptionPrimary,
  descriptionSecondary,
  errorCard,
  action,
  footer,
  hideBottomNav,
}: StatusScreenProps) {
  const content = (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      {" "}
      <div className="flex w-full max-w-sm flex-col items-center">
        {/* Ícone principal */}
        <div className="mb-6">{icon}</div>

        {/* Título */}
        <h1 className="text-[30px] font-semibold leading-[36px] text-[#1E2939]">
          {title}
        </h1>

        {/* Descrição principal */}
        {descriptionPrimary && (
          <p className="mt-3 text-base leading-6 text-[#4A5565]">
            {descriptionPrimary}
          </p>
        )}

        {/* Descrição secundária */}
        {descriptionSecondary && (
          <p className="mt-1 text-sm leading-5 text-[#6A7282]">
            {descriptionSecondary}
          </p>
        )}

        {/* Card de erro */}
        {errorCard && <div className="mt-6 w-full">{errorCard}</div>}

        {/* Botão de ação */}
        {action && <div className="mt-8 w-full">{action}</div>}

        {/* Rodapé */}
        {footer && <p className="mt-8 text-xs text-[#9AA1AC]">{footer}</p>}
      </div>
    </div>
  );

  /**

* Caso hideBottomNav seja verdadeiro,
  apenas renderiza o conteúdo normalmente.
  O AppLayout continua responsável pelo layout geral
  */
  if (hideBottomNav) {
    return <AppLayout>{content}</AppLayout>;
  }

  /**

* Comportamento padrão da aplicação
  */
  return <AppLayout>{content}</AppLayout>;
}
