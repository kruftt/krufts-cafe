import { useEditor } from "@hooks/editor";
import { Input } from "@ui/input";
import { useEffect, useRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	onSave: (value: string) => void;
	children: string;
	Component: React.ComponentType<React.PropsWithChildren>;
}

export function InputEditor({
	children,
	className,
	Component,
	onSave,
	...rest
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { editor, setEditor, draft, setDraft, submit } = useEditor(inputRef, children, onSave);
	
	return editor ? (
		<Input
			ref={inputRef}
			className={`border-0 ring-0! ${className}`}
			value={draft}
			onChange={(e) => setDraft(e.target.value)}
			onBlur={submit}
			onKeyDown={(e) => e.key === "Enter" && submit()}
			{...rest}
		/>
	) : (
		<div>
			<button type="button" onClick={() => setEditor(true)}>
				<Component>{draft}</Component>
			</button>
		</div>
	);
}
