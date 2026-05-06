import { InputEditor } from "@components/edit/input-editor";
import { InstructionView, instructionStyles } from "@components/view";
import { useTRPC } from "@lib/trpc";
import type { Instruction } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { XIcon } from "lucide-react";

interface Props extends React.ComponentProps<"div"> {
	instruction: Instruction.Model;
	onDelete: () => void;
	index: number;
}

export function InstructionEditor({ instruction, onDelete, index }: Props) {
	const trpc = useTRPC();
	const updateMutation = useMutation(trpc.instruction.update.mutationOptions());

	return (
		<div className="group flex items-center gap-2">
			<Button
				variant="ghost"
				className="p-1 h-auto"
				onClick={onDelete}
			>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<span>{index}.</span>
			<InputEditor
				value={instruction.description}
				className={instructionStyles}
				placeholder="Insert instruction here"
				onSave={(description) =>
					updateMutation.mutate({ ...instruction, description })
				}
			/>
		</div>
	);
}
