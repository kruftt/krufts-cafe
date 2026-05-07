import { InputEditor } from "@components/edit/input-editor";
import { useTRPC } from "@lib/trpc";
import type { Instruction } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { XIcon } from "lucide-react";
import { TextareaEditor } from "./textarea-editor";

interface Props extends React.ComponentProps<"div"> {
	instruction: Instruction.Model;
	onDelete: () => void;
	index: number;
}

export function InstructionEditor({ instruction, onDelete, index }: Props) {
	const trpc = useTRPC();
	const updateMutation = useMutation(trpc.instruction.update.mutationOptions());

	return (
		<div className="flex items-start justify-start gap-1">
			<Button
				variant="ghost"
				className="w-8 h-8 relative -top-0.5"
				onClick={onDelete}
			>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<div className="instruction">
				<span className="">{index}.</span>
				<TextareaEditor
					value={instruction.description}
					placeholder="Insert instruction here"
					onSave={(description) =>
						updateMutation.mutate({ ...instruction, description })
					}
				/>
			</div>
		</div>
	);
}
