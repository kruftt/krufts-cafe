import { Button } from "@components/ui/button";
import type { StepData } from "@services/recipe";
import { ArrowUpIcon, ArrowUpToLineIcon, ForkKnifeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  steps: StepData[]
}

export function StepBar({ steps }: Props) {
  const bar = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = ["ingredients", ...steps.map((_, i) => `step_${i + 1}`)];
    let barH: number;
    let sections: { id: string, el: HTMLElement, top: number }[];
    recompute();

    function recompute() {
      barH = bar.current?.clientHeight ?? 0;
      const raw = ids.map(id => {
        const el = document.getElementById(id) as HTMLElement;
        return { id, el, top: el.offsetTop };
      });
      sections = raw.map((s, i) => ({
        ...s,
        top: Math.round(((raw[i - 1]?.top ?? 0) + s.top) / 2),
      }));
    }

    function onScroll() {
      const bottom = window.scrollY + barH;
      let activeIdx = -1;
      for (let i = 0; i < sections.length; i++) {
				// biome-ignore lint: guaranteed
        if (bottom >= sections[i]!.top) activeIdx = i;
      }

      const activeSection = sections[activeIdx];
      sections.forEach(({ el }, i) => { el.classList.toggle("panel__section--active", i === activeIdx); });
      setActiveId(activeSection?.id ?? null);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recompute, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recompute);
    };
  }, [steps]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el || !bar.current) return;
    window.scrollTo({
      top: el.offsetTop - bar.current.clientHeight - 16,
      behavior: 'smooth',
    })
  }

  return (
		<div
			ref={bar}
			className="mb-4 pt-1.5 pb-1 bg-background flex gap-1 justify-center sticky top-0 border-b border-primary/70 light:shadow-[0_0_3px_3px_rgba(0,0,0,0.2)] dark:shadow-[0_0_3px_3px_rgba(0,0,0,0.5)]"
		>
			<Button className="border-secondary/40 min-w-10" variant={activeId === null ? "default" : "outline"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
				<ArrowUpToLineIcon />
			</Button>
			<Button className="border-secondary/40 min-w-10" variant={activeId === "ingredients" ? "default" : "outline"} onClick={() => scrollTo("ingredients")}>
				<ForkKnifeIcon />
			</Button>
			{steps.map((step, i) => (
				<Button className="border-secondary/40 min-w-10" variant={activeId === `step_${i + 1}` ? "default" : "outline"} key={step.id} onClick={() => scrollTo(`step_${i + 1}`)}>
					{i + 1}
				</Button>
			))}
		</div>
	);
}