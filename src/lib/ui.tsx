import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type UI = { reserveOpen: boolean; setReserveOpen: (open: boolean) => void };

const UICtx = createContext<UI | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [reserveOpen, setReserveOpen] = useState(false);
  const value = useMemo(() => ({ reserveOpen, setReserveOpen }), [reserveOpen]);
  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export function useUI() {
  const c = useContext(UICtx);
  if (!c) throw new Error("useUI outside provider");
  return c;
}
