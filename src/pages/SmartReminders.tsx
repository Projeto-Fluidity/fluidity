import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { reminderCategories }
  from "../data/reminderCategories";
import type { ReminderCategory }
  from "../types/reminderCategory";

/**
 * ============================================================
 * SMART REMINDERS
 * ============================================================
 *
 * Tela intermediária responsável pela seleção
 * de categorias dos Lembretes Inteligentes.
 *
 * Fluxo:
 *
 * Configurações
 *      ↓
 * Lembretes Inteligentes
 *      ↓
 * Seleção da categoria
 *      ↓
 * Configuração dos lembretes
 *
 * Nesta etapa da implementação a tela possui
 * apenas responsabilidade visual.
 *
 * A navegação para ReminderConfig será conectada
 * em uma etapa posterior.
 */
export default function SmartReminders() {

  const navigate = useNavigate();

    /**
   * ==========================================================
   * NAVIGATION
   * ==========================================================
   *
   * Encaminha o usuário para a tela de configuração
   * da categoria selecionada.
   *
   * Nesta primeira versão a categoria ainda não
   * altera o comportamento da tela de configuração,
   * mas já é enviada para preparar futuras evoluções.
   */
  function handleCategoryClick(
    category: ReminderCategory,
  ) {
    navigate("/reminder-config", {
      state: {
        category,
      },
    });
  }

  return (

    <div className="min-h-screen bg-[#DCFCE7] pb-24">

      <div className="px-4 pt-6">

        {/**
         * ======================================================
         * HEADER
         * ======================================================
         */}
        <div className="mb-6 flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="
              flex h-8 w-8 items-center
              justify-center rounded-full
              bg-white
            "
          >
            <ChevronLeft size={18} />
          </button>

          <div>

            <h1
              className="
                text-lg font-semibold
                text-[#0F172A]
              "
            >
              Lembretes Inteligentes
            </h1>

            <p
              className="
                text-xs
                text-[#64748B]
              "
            >
              Escolha uma categoria para configurar
            </p>

          </div>

        </div>

        {/**
         * ======================================================
         * CATEGORIES
         * ======================================================
         */}
        <div className="space-y-3">

          {reminderCategories.map((category) => {

            /**
             * O ícone é armazenado na camada de dados.
             *
             * Como componentes React devem iniciar com
             * letra maiúscula, criamos uma referência
             * local para utilizá-lo na renderização.
             */
            const Icon = category.icon;

            return (

              <button
                key={category.id}
                type="button"
                onClick={() =>
                  handleCategoryClick(category.id)
                }
                className="
                  w-full
                  rounded-2xl
                  bg-white
                  p-4
                  shadow-sm
                  transition-all
                  duration-200
                  hover:shadow-md
                "
              >
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        flex h-10 w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-[#DCFCE7]
                      "
                    >
                      <Icon
                        size={20}
                        className="text-[#008236]"
                      />
                    </div>

                    <div className="text-left">

                      <p
                        className="
                          font-medium
                          text-[#0F172A]
                        "
                      >
                        {category.title}
                      </p>

                      <p
                        className="
                          text-sm
                          text-[#64748B]
                        "
                      >
                        {category.description}
                      </p>

                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-[#94A3B8]"
                  />

                </div>

              </button>

            );
          })}

        </div>

      </div>

    </div>

  );
}