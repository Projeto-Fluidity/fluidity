import type { ReactNode } from "react";
import clsx from "clsx";

type Variant = "error" | "success";

interface StatusIconProps {
  icon: ReactNode;
  variant: Variant;
}

export default function StatusIcon({ icon, variant }: StatusIconProps) {
  /**
   * Variante SUCCESS (padrão único do app)
   */
  if (variant === "success") {
    return (
      <div className="flex items-center justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full 
          bg-gradient-to-br from-[#05DF72] to-[#00A63E] shadow-md"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white">
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Variante ERROR (mantida)
   */
  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full",
        "h-[136px] w-[136px]",
        "bg-[#FF6467]/40",
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center rounded-full",
          "h-[130px] w-[130px]",
          "border-[2px]",
          "border-[#FFB3B5] bg-error",
        )}
      >
        <div className="text-[#FFB3B5]">{icon}</div>
      </div>
    </div>
  );
}