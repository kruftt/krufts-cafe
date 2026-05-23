import { Panel } from "@components/app";
import {
	DeletionDialog,
	InputEditor,
	TextareaEditor,
} from "@components/controls";
import { Button } from "@components/ui/button";
import type { CachedStepData } from "@hooks/recipe-cache";
import { RecipeIdContext, useRecipeCache } from "@hooks/recipe-cache";
import { getNextIndex } from "@lib/utils";
import { PlusIcon, XIcon } from "lucide-react";
import { useContext, useRef } from "react";
import { InstructionEditor } from "./instruction-editor";

interface Props {
	index: number;
	step: CachedStepData;
}

export function StepEditor({ step, index }: Props) {
	const instructionsRef = useRef<HTMLDivElement>(null);
	const { updateStepField, removeStep, addInstruction } = useRecipeCache(
		useContext(RecipeIdContext),
	);

	function deleteStep() {
		if (step.id) removeStep.mutate({ id: step.id });
	}

	function createInstruction() {
		if (!step.id) return;
		addInstruction.mutate({
			stepId: step.id,
			index: getNextIndex(step.instructions),
		});
		requestAnimationFrame(() => requestAnimationFrame(() => {
			const el = instructionsRef.current;
			if (!el) return;
			const textareas = el.querySelectorAll<HTMLTextAreaElement>(":scope textarea");
			const last = textareas.item(textareas.length - 1);
			if (last) last.focus();
		}));
	}

	return (
		<Panel.Section className="relative">
			<DeletionDialog
				title="Delete Step"
				message="Are you sure you want to delete this step?"
				item={step.name}
				onConfirm={deleteStep}
			>
				<Button variant="ghost" className="absolute z-10 top-4 right-4">
					<XIcon color="red" className="size-7" />
				</Button>
			</DeletionDialog>

			<Panel.Title>
				<span className="panel__index">{index}.</span>
				<InputEditor
					className="grow"
					placeholder="Step Name"
					onSave={updateStepField(step.id, "name")}
					value={step.name}
				/>
			</Panel.Title>

			<Panel.Item>
				<TextareaEditor
				value={step.intro}
					className="step__intro"
					placeholder="Step overview (optional)..."
					onSave={updateStepField(step.id, "intro")}
				/>
			</Panel.Item>

			<Panel.Item ref={instructionsRef}>
				{step.instructions.map((instruction, i) => (
					<InstructionEditor
						key={instruction.clientKey ?? instruction.id}
						index={i + 1}
						instruction={instruction}
					/>
				))}

				<div className="text-center">
					<Button
						// variant="ghost"
						className="justify-start mt-1 px-2"
						onClick={createInstruction}
					>
						<PlusIcon />
						Add Instruction
					</Button>
				</div>
			</Panel.Item>
		</Panel.Section>
	);
}
