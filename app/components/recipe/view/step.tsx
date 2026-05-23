import { Panel } from "@components/app";
import type { StepData } from "@services/recipe";

interface Props extends React.ComponentProps<"div"> {
  index: number;
  step: StepData;
	single: boolean;
}

export function Step({ index, single, step }: Props) {
  return (
			<Panel.Section id={`step_${index}`}>
				{!single && (
					<Panel.Title>
						<span className="panel__index">{index}</span>
						{step.name}
					</Panel.Title>
				)}

				{step.intro && (
					<Panel.Item className="step__intro">{step.intro}</Panel.Item>
				)}

				<Panel.Item>
					{step.instructions.map((instruction, i) => (
						<div key={instruction.id} className="instruction">
							<span>{i + 1}.</span>
							<span>{instruction.text}</span>
						</div>
					))}
				</Panel.Item>
			</Panel.Section>
		);
}