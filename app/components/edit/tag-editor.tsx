import { Button } from "@components/ui/button";
import { Badge } from "@ui/badge";
import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { InputEditor } from "./input-editor";

interface Props extends React.ComponentProps<'div'> {
	tags: string[];
	onSave: (v: string[]) => void;
}

export function TagEditor({ onSave, tags: _tags }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
	const [tags, setTags] = useState(_tags);

	function createTag(tag: string) {
		if (tag === "" || tags.includes(tag)) return;
		setTags([...tags, tag]);
		onSave(tags);
	}

	function editTag(tag: string, index: number) {
		if (tag === "") return;
		setTags(tags.map((t, i) => (i === index ? tag : t)));
		onSave(tags);
	}

	function removeTag(index: number) {
		setTags(tags.filter((_, i) => i !== index));
		onSave(tags);
	}

	return (
		<div className="recipe__tags">
			{tags.map((tag, i) => (
				<Badge key={tag}>
					<Button
            variant="ghost"
            className="p-0"
            onClick={() => removeTag(i)}
          >
						<XIcon color="red" />
					</Button>
					<InputEditor onSave={(v) => editTag(v, i)} value={tag} resize />
				</Badge>
			))}
			<InputEditor
				ref={inputRef}
				className="text-center"
				onSave={createTag}
				placeholder="Add new tag..."
				clear
			/>
		</div>
	);
}
