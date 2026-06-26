"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Shared open/close state for the mobile navigation drawer. The Topbar's
 * hamburger opens it and the Sidebar renders into it, so they need a common
 * piece of state. The drawer auto-closes whenever the route changes.
 */
const Ctx = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  // Close the drawer whenever the route changes. Syncing drawer state to the
  // router is an external-system effect; the rule below targets gratuitous
  // setState-in-effect, which this is not.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [path]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

export function useMobileNav() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMobileNav must be used within MobileNavProvider");
  return ctx;
}
