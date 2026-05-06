import { type KeyboardEventHandler, useState } from "react";

interface Props extends React.ComponentProps<"input"> {
	onSave: (value: string) => void;
	clear?: boolean;
	resize?: boolean;
}

export function InputEditor({
	className,
	clear,
	onSave,
	value,
	resize,
	...rest
}: Props) {
	const [draft, setDraft] = useState(value || "");

	function submit() {
		onSave(draft as string);
		if (clear) setDraft("");
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			submit();
			e.currentTarget.blur();
		}
	}

	return (
		<input
			className={`
				block bg-transparent border-none outline-none p-0 m-0 font-inherit text-inherit
				${resize ? "field-sizing-content" : "w-1/1"}
				${className}
			`}
			value={draft}
			onChange={(e) => setDraft(e.target.value)}
			onBlur={submit}
			onKeyDown={onKeyDown}
			{...rest}
		/>
	);
}
