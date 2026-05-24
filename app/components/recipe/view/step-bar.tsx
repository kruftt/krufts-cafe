import { activeStepIdAtom } from "@atoms/recipe";
import { Button } from "@components/ui/button";
import { useScrollNavigationContext } from "@hooks/scroll-navigation";
import type { StepData } from "@services/recipe";
import { useAtomValue } from "jotai";
import { ArrowUpToLineIcon, ForkKnifeIcon } from "lucide-react";

interface Props {
  steps: StepData[]
}

export function StepBar({ steps }: Props) {
  const { barRef, scrollTo } = useScrollNavigationContext();
  const activeId = useAtomValue(activeStepIdAtom);

  return (
    <div
      ref={barRef}
      className="mb-4 pt-2 pb-1.5 bg-background flex gap-1 justify-center sticky top-0 border-b border-primary/70 light:shadow-[0_0_3px_3px_rgba(0,0,0,0.2)] dark:shadow-[0_0_3px_3px_rgba(0,0,0,0.5)]"
    >
      <Button className="border-secondary/40 min-w-10" variant={activeId === null ? "default" : "outline"} onClick={() => scrollTo(null)}>
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
