import { TextareaEditor } from "@components/controls";
import { Button } from "@components/ui/button";
import { RecipeIdContext, useRecipeCache } from "@hooks";
import type { InstructionData } from "@services/recipe";
import { XIcon } from "lucide-react";
import { useContext } from "react";

interface Props extends React.ComponentProps<"div"> {
	index: number;
	instruction: InstructionData;
}

export function InstructionEditor({ index, instruction }: Props) {
	const { updateInstructionField, removeInstruction } = useRecipeCache(
		useContext(RecipeIdContext),
	);

	return (
		<div className="flex items-start justify-start gap-1">
			<Button
				variant="ghost"
				className="w-8 h-8 relative -top-0.5"
				onClick={() => removeInstruction.mutate({ id: instruction.id })}
			>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<div className="instruction">
				<span className="">{index}.</span>
				<TextareaEditor
					value={instruction.text}
					placeholder="Insert instruction here"
					onSave={updateInstructionField(instruction.id, "text")}
				/>
			</div>
		</div>
	);
}
