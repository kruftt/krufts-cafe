import { useState } from "react";

export function useEditor(initialValue: string, onSave: (v: string) => void) {
	const [editor, setEditor] = useState(initialValue === "");
	const [draft, setDraft] = useState(initialValue);
	
	function submit() {
		onSave(draft);
		setEditor(draft === "");
	}

	return { editor, setEditor, draft, setDraft, submit };
}
