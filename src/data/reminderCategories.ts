import {
  Coffee,
  Droplets,
  Moon,
  Smile,
} from "lucide-react";

import type { LucideIcon }
  from "lucide-react";

import type { ReminderCategory }
  from "../types/reminderCategory";

/**
 * ============================================================
 * REMINDER CATEGORY ITEM
 * ============================================================
 *
 * Estrutura utilizada pela tela de seleção de
 * categorias dos Lembretes Inteligentes.
 *
 * Cada item representa um card exibido para
 * o usuário.
 */
export type ReminderCategoryItem = {

  /**
   * Identificador interno da categoria.
   */
  id: ReminderCategory;

  /**
   * Título exibido no card.
   */
  title: string;

/**
 * Descrição exibida no card.
 */
description: string;

  /**
   * Ícone associado à categoria.
   *
   * É armazenado na camada de dados para manter
   * todas as informações necessárias para renderizar
   * o card em um único local.
   */
  icon: LucideIcon;
  };

/**
 * ============================================================
 * REMINDER CATEGORIES
 * ============================================================
 *
 * Fonte única de verdade das categorias
 * disponíveis no Hub de Lembretes Inteligentes.
 *
 * Benefícios:
 *
 * - evita hardcode na interface;
 * - facilita manutenção;
 * - permite expansão futura;
 * - mantém separação entre dados e UI.
 *
 * A tela deverá apenas consumir esta lista
 * e renderizar os cards dinamicamente.
 */
export const reminderCategories:
  ReminderCategoryItem[] = [

  {
    id: "hydration",
    title: "Hora de se hidratar",
    description: "Beba água regularmente",
    icon: Droplets,
  },

  {
    id: "mood",
    title: "Como está seu humor?",
    description: "Registre seu humor diariamente",
    icon: Smile,
  },

  {
    id: "break",
    title: "Faça uma pausa",
    description: "Pequenos intervalos ajudam no foco",
    icon: Coffee,
  },

  {
    id: "relax",
    title: "Hora de relaxar",
    description: "Desacelere e cuide do seu bem-estar",
    icon: Moon,
  },
];
