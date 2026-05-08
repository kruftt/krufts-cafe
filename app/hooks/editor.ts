import { useState } from "react";

export function useEditor(
	initialValue: string | number | readonly string[],
	onSave: (v: string) => void,
	validate?: (value: string) => string | undefined,
	ctrl?: boolean,
	clear?: boolean
) {
	const [draft, setDraft] = useState(initialValue);
	const [error, setError] = useState("");
	
	function submit() {
		const message = validate?.(draft as string);
		if (message) {
			setError(message);
			return;
		}
		onSave(draft as string);
		if (clear) setDraft("");
	}

	function onChange(
		e:
			| React.ChangeEvent<HTMLTextAreaElement>
			| React.ChangeEvent<HTMLInputElement>,
	) {
		setDraft(e.currentTarget.value);
		if (error) setError("");
	}

	function onKeyDown(
		e:
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.KeyboardEvent<HTMLInputElement>,
	) {
		if (ctrl && !e.ctrlKey) return;
		if (e.key === "Enter") {
			submit();
			e.currentTarget.blur();
		}
	}

	return { draft, error, onKeyDown, onChange, submit };
}
