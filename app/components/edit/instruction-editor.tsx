import { InputEditor } from "@components/edit/input-editor";
import { InstructionView, instructionStyles } from "@components/view";
import { useTRPC } from "@lib/trpc";
import type { Instruction } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { XIcon } from "lucide-react";

export function InstructionEditor({
	instruction,
	onDelete,
}: {
	instruction: Instruction.Model;
	onDelete: () => void;
}) {
	const trpc = useTRPC();
	const updateMutation = useMutation(trpc.instruction.update.mutationOptions());

	return (
		<div className="group flex items-center gap-2">
			<Button
				variant="ghost"
				className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 h-auto"
				onClick={onDelete}
			>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<InputEditor
				Component={InstructionView}
				styles={instructionStyles}
				onSave={(description) =>
					updateMutation.mutate({ ...instruction, description })
				}
			>
				{instruction.description}
			</InputEditor>
		</div>
	);
}
