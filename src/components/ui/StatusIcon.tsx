import type { ReactNode } from "react";
import clsx from "clsx";

type Variant = "error" | "success";

interface StatusIconProps {
icon: ReactNode;
variant: Variant;
}

/**

* Ícone utilizado nas telas de feedback da aplicação.
*
* success → layout fiel ao Figma
* error   → layout atual preservado para MoodError
  */
  export default function StatusIcon({ icon, variant }: StatusIconProps) {
  /**

  * Variante SUCCESS
    */
    if (variant === "success") {
    return (

     <div className="flex items-center justify-center rounded-full bg-[#DCFCE7] h-[128px] w-[128px]">
       <div className="flex items-center justify-center rounded-full border-[8px] border-[#008236] h-[80px] w-[80px] text-[#008236]">
         {icon}
       </div>
     </div>

  );
  }

/**

* Variante ERROR
* Mantida para não alterar MoodError
  */
  return (
  <div
  className={clsx(
  "flex items-center justify-center rounded-full",
  "h-[136px] w-[136px]",
  "bg-[#FF6467]/40"
  )}
  >

   <div
     className={clsx(
       "flex items-center justify-center rounded-full",
       "h-[130px] w-[130px]",
       "border-[2px]",
       "bg-error border-[#FFB3B5]"
     )}
   >
     <div className="text-[#FFB3B5]">{icon}</div>
   </div>


</div>


);
}
