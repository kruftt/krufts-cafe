import { Button } from "@components/ui/button";
import type { StepData } from "@services/recipe";
import { ArrowUpIcon, ForkKnifeIcon } from "lucide-react";
import { useRef } from "react";

interface Props {
  steps: StepData[]
}

export function StepBar({ steps }: Props) {
  const bar = useRef<HTMLDivElement>(null);

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
			<Button className="border-secondary/40 min-w-10" variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
				<ArrowUpIcon />
			</Button>
			<Button className="border-secondary/40 min-w-10" variant="outline" onClick={() => scrollTo("ingredients")}>
				<ForkKnifeIcon />
			</Button>
			{steps.map((step, i) => (
				<Button className="border-secondary/40 min-w-10" variant="outline" key={step.id} onClick={() => scrollTo(`step_${i + 1}`)}>
					{i + 1}
				</Button>
			))}
		</div>
	);
}