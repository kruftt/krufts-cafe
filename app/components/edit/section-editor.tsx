import { ContentPane } from "@components/app";
import { DeletionDialog, InputEditor, TextareaEditor } from "@components/edit";
import { SectionTitle, sectionTitleStyles } from "@components/view";
import { SectionDescription, sectionDescriptionStyles } from "@components/view/section/section-description";
import { useTRPC } from "@lib/trpc";
import type { Section } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { XIcon } from "lucide-react";
import { useState } from "react";

export function SectionEditor({
	section,
	deleteSection,
}: {
	section: Section.Full;
	deleteSection: () => void;
}) {
  const [instructions, setInstructions] = useState(section.instructions);
  const [ingredients, setIngredients] = useState(section.ingredients);

	const trpc = useTRPC();
	const updateSectionMutation = useMutation({
		...trpc.section.update.mutationOptions(),
	});
  
	function updateSection(
		field: keyof Section.Model,
		value: string,
		onError?: () => void,
	) {
		updateSectionMutation.mutate({ ...section, [field]: value }, { onError });
	}

	return (
		<ContentPane>
			<div className="relative text-center">
				<div className="absolute right-0">
					<DeletionDialog
						title="Delete Section"
						message="Are you sure you wish to remove this section?"
						item={section.name}
						onConfirm={deleteSection}
					>
						<Button size="icon-sm">
							<XIcon color="red" />
						</Button>
					</DeletionDialog>
				</div>
				<InputEditor
					Component={SectionTitle}
					className={sectionTitleStyles}
					onSave={(v) => updateSection("name", v)}
				>
					{section.name}
				</InputEditor>
      </div>
      <TextareaEditor
        Component={SectionDescription}
        className={sectionDescriptionStyles}
        onSave={(v) => updateSection("description", v)}
        placeholder="Section description..."
      >
        { section.description }
      </TextareaEditor>
			{/* <InputEditor
        Component={} */}
		</ContentPane>
	);
}
