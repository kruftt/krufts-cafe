import { useEditor } from "@hooks/editor";
import { Textarea } from "@ui/textarea";
import { useEffect, useRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	onSave: (value: string) => void;
	children: string;
	Component: React.ComponentType<React.PropsWithChildren>;
}

export function TextareaEditor({
	children,
	className,
	Component,
	onSave,
	...rest
}: Props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { editor, setEditor, draft, setDraft, submit } = useEditor(
		textareaRef,
		children,
		onSave,
	);

	return draft === "" || editor ? (
		<Textarea
			ref={textareaRef}
			className={`border-0 ring-0! ${className}`}
			value={draft}
			onFocus={() => setEditor(true)}
			onBlur={submit}
			onChange={(e) => setDraft(e.target.value)}
			onKeyDown={(e) =>
				e.key === "Enter" &&
				e.ctrlKey &&
				(e.target as HTMLTextAreaElement).blur() &&
				submit()
			}
			{...rest}
		/>
	) : (
		<div>
			<button type="button" className="w-1/1" onClick={() => setEditor(true)}>
				<Component>{draft}</Component>
			</button>
		</div>
	);
}
