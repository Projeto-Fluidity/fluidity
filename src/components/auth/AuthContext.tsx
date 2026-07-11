import { createContext } from "react";

import type { AuthContextValue } from "../../types/auth";

/**
 * ============================================================
 * AUTH CONTEXT
 * ============================================================
 */
export const AuthContext =
  createContext<AuthContextValue | null>(null);
  