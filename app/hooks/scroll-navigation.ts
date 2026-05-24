import { activeStepIdAtom } from "@atoms/recipe";
import type { StepData } from "@services/recipe";
import { useSetAtom } from "jotai";
import { createContext, useContext, useEffect, useRef } from "react";

export interface ScrollNavigation {
  barRef: React.RefObject<HTMLDivElement | null>;
  scrollTo: (id: string | null) => void;
}

export const ScrollNavigationContext = createContext<ScrollNavigation | null>(null);

export function useScrollNavigationContext() {
  const ctx = useContext(ScrollNavigationContext);
  if (!ctx) throw new Error("ScrollNavigationContext not provided");
  return ctx;
}

export function useScrollNavigation(steps: StepData[]): ScrollNavigation {
  const barRef = useRef<HTMLDivElement>(null);
  const setActiveId = useSetAtom(activeStepIdAtom);
  const lockRef = useRef<string | null | undefined>(undefined);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const introEl = document.getElementById("intro");
    const ids = [...(introEl ? ["intro"] : []), "ingredients", ...steps.map((_, i) => `step_${i + 1}`)];

    let prevViewportMiddle = window.scrollY + window.innerHeight / 2;
    let sections: { id: string; top: number; bottom: number }[] = [];

    recompute();

    function recompute() {
      const barH = barRef.current?.clientHeight ?? 0;
      sections = ids.flatMap((id) => {
        const el = document.getElementById(id);
        if (!el) return [];
        const top = el.offsetTop - barH;
        const bottom = el.offsetTop + el.offsetHeight;
        return [{ id, top, bottom }];
      });
    }

    function onScroll() {
      if (lockRef.current !== undefined) {
        setActiveId(lockRef.current);
        return;
      }

      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      const down = viewportMiddle >= prevViewportMiddle;

      let next: string | null | undefined;
      if (down) {
        for (const s of sections) {
          if (s.top <= viewportMiddle) next = s.id;
        }
      } else {
        for (const s of sections) {
          if (s.bottom >= viewportMiddle) { next = s.id; break; }
        }
      }

      prevViewportMiddle = viewportMiddle;
      if (next === undefined) return;
      if (next === "intro") next = null;

      setActiveId(next);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recompute, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recompute);
    };
  }, [steps, setActiveId]);

  function lock(id: string | null) {
    lockRef.current = id;
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => {
      lockRef.current = undefined;
      lockTimeoutRef.current = null;
    }, 1000);
  }

  function scrollTo(id: string | null) {
    lock(id);
    setActiveId(id);
    const el = id ? document.getElementById(id) : null;
    window.scrollTo({
      top: el && barRef.current ? el.offsetTop - barRef.current.clientHeight - 16 : 0,
      behavior: "smooth",
    });
  }

  return { barRef, scrollTo };
}
