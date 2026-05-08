import { Button } from "@components/ui/button";
import type { ProcedureOptions } from "@hooks";
import { Badge } from "@ui/badge";
import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { InputEditor } from "./input-editor";

interface Props extends React.ComponentProps<"div"> {
	tags: string[];
	onSave: (v: string[], options: ProcedureOptions) => void;
}

export function TagEditor({ onSave, tags: _tags }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [tags, setTags] = useState(_tags);
	const [error, setError] = useState("");

	// onSave(value, setError)

	function createTag(tag: string, options: ProcedureOptions) {
		if (tag === "") {
			options.onError("Please enter a tag.");
			return;
		}
		
		if (tags.includes(tag)) {
			options.onError("Tag already exists.");
			return;
		}

		const next = [...tags, tag];
		setTags(next);
		onSave(next, {
			onSuccess: options.onSuccess,
			onError: options.onError,
		});
	}

	function removeTag(index: number) {
		const next = tags.filter((_, i) => i !== index);
		setTags(next);
		onSave(next, {
			onError(message) {
				setError(message);
			},
			onSuccess() {},
		});
	}

	return (
		<div>
			<div className="recipe__tags">
				{tags.map((tag, i) => (
					<Badge key={tag} className="overflow-visible">
						<Button
							data-icon="inline-start"
							variant="ghost"
							className="rounded-l-4xl p-0 h-6 w-6 -ml-2 -mr-0.5"
							onClick={() => removeTag(i)}
						>
							<XIcon className="" color="red" />
						</Button>
						{tag}
					</Badge>
				))}
			</div>
			<InputEditor
				ref={inputRef}
				className="text-center -mt-1.5 w-60 m-auto rounded-xl"
				onSave={createTag}
				placeholder="Add new tag..."
				clear
			/>
		</div>
	);
}
