import { useState } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	onSave: (value: string) => void;
	resize?: boolean
}

export function TextareaEditor({
	className,
	onSave,
	value,
	resize,
	...rest
}: Props) {
	const [draft, setDraft] = useState(value);
		
	function submit() {
		onSave(draft as string);
	}

	return (
		<textarea
			className={`
				block bg-transparent border-none outline-none p-0 m-0 font-inherit text-inherit field-sizing-content
				${resize ? "field-sizing-content" : "w-1/1"}
				${className}
			`}
			value={draft}
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
	);
}
