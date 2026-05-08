import { useState } from "react";

export interface ProcedureOptions {
	onError: (value: string) => void;
	onSuccess: () => void;
}

export interface EditorOptions {
	clear?: boolean;
	ctrl?: boolean;
	reset?: boolean;
}

type InputTypes = string | number | readonly string[];

export function useEditor(
	initialValue: InputTypes,
	onSave: (v: string, options: ProcedureOptions) => void,
	validate?: (value: string) => string | undefined,
	options: EditorOptions = {}
) {
	const [value, setValue] = useState(initialValue);
	const [dirty, setDirty] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const { clear, ctrl, reset } = options;
	
	function submit() {
		if (!dirty) return;
		setDirty(false);
		const message = validate?.(value as string);
		if (message) {
			setError(message);
			if (reset) setValue(initialValue);
			if (clear) setValue("");
			return;
		}

		setBusy(true);

		onSave(value as string, {
			onError(message) {
				setError(message);
				setBusy(false);
				if (reset) setValue(initialValue);
				if (clear) setValue("");
			},
			onSuccess() {
				setBusy(false);
				if (clear) setValue("");
			}
		});
	}

	function onChange(
		e:
			| React.ChangeEvent<HTMLTextAreaElement>
			| React.ChangeEvent<HTMLInputElement>,
	) {
		setValue(e.currentTarget.value);
		setDirty(true);
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
		}
	}

	function onBlur() {
		if (dirty) submit();
		else setError("");
	}

	return { value, busy, error, onKeyDown, onChange, onBlur, submit };
}
