import { useEditor } from "@hooks/editor";
import { Textarea } from "@ui/textarea";
import { useEffect, useRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	onSave: (value: string) => void;
	children: string;
	Component: React.ComponentType<React.PropsWithChildren>;
	styles: string;
}

export function TextareaEditor({
	children,
	className,
	Component,
	styles,
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
		<div className={className}>
			<Textarea
				ref={textareaRef}
				className={`w-1/1 ring-0! border-none! ${styles}`}
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
		</div>
	) : (
		<button
			type="button"
			className={`block w-1/1 hover:bg-white/5 ${className}`}
			onClick={() => setEditor(true)}
		>
			<Component>{draft}</Component>
		</button>
	);
}
