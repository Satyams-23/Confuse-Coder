"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "cc" | "dev";

const Ctx = createContext<{ theme: Theme; switchTo: (t: Theme, origin?: { x: number; y: number }) => void }>({
  theme: "cc",
  switchTo: () => {},
});

export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("cc");

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    if (t === "dev" || t === "cc") setTheme(t);
  }, []);

  const switchTo = useCallback(
    (t: Theme, origin?: { x: number; y: number }) => {
      if (t === theme) return;
      const apply = () => {
        document.documentElement.dataset.theme = t;
        setTheme(t);
        try {
          localStorage.setItem("cc-theme", t);
        } catch {}
      };
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!doc.startViewTransition || reduce) return apply();

      // Circle wipe from the toggle that was clicked.
      const x = origin?.x ?? innerWidth / 2;
      const y = origin?.y ?? 0;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      doc.startViewTransition(apply).ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(.7,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
        );
      });
    },
    [theme],
  );

  return <Ctx.Provider value={{ theme, switchTo }}>{children}</Ctx.Provider>;
}
