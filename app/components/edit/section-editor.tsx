import { ContentPane } from "@components/app";
import { InputEditor, TextareaEditor } from "@components/edit";

import { useTRPC } from "@lib/trpc";
import type { Section } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";

export function SectionEditor({ section }: { section: Section.Full }) {
	const trpc = useTRPC();
	const updateSection = useMutation({
		...trpc.section.update.mutationOptions(),
	});

	function saveSection(
		field: keyof Section.Model,
		value: string,
		onError?: () => void,
	) {
		updateSection.mutate({ ...section, [field]: value }, { onError });
	}

	return (
		<ContentPane>
      Section editor
      {/* <InputEditor
        Component={} */}
    </ContentPane>
	);
}
