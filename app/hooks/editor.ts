import { useEffect, useState } from "react";

export function useEditor(ref: React.RefObject<HTMLElement | null>, initialValue: string, onSave: (v: string) => void) {
	const [editor, setEditor] = useState(false);
	const [draft, setDraft] = useState(initialValue);
	
	// biome-ignore lint: false positive
	useEffect(() => {
		if (editor) ref.current?.focus();
	}, [editor]);

	function submit() {
		onSave(draft);
		setEditor(false);
	}

	return { editor, setEditor, draft, setDraft, submit };
}
