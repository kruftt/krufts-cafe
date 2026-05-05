import { ContentPane } from "@components/app";
import { DeletionDialog, InputEditor, TextareaEditor } from "@components/edit";
import { IngredientEditor } from "@components/edit/ingredient-editor";
import { InstructionEditor } from "@components/edit/instruction-editor";
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
	const updateSectionMutation = useMutation(trpc.section.update.mutationOptions());
	const createIngredientMutation = useMutation(trpc.ingredient.create.mutationOptions());
	const deleteIngredientMutation = useMutation(trpc.ingredient.delete.mutationOptions());
	const createInstructionMutation = useMutation(trpc.instruction.create.mutationOptions());
	const deleteInstructionMutation = useMutation(trpc.instruction.delete.mutationOptions());
  
	function updateSection(field: keyof Section.Model, value: string, onError?: () => void) {
		updateSectionMutation.mutate({ ...section, [field]: value }, { onError });
	}

	function deleteIngredient(id: number) {
		const prev = ingredients;
		setIngredients(ingredients.filter((i) => i.id !== id));
		deleteIngredientMutation.mutate({ id }, { onError: () => setIngredients(prev) });
	}

	function deleteInstruction(id: number) {
		const prev = instructions;
		setInstructions(instructions.filter((i) => i.id !== id));
		deleteInstructionMutation.mutate({ id }, { onError: () => setInstructions(prev) });
	}

	function addIngredient() {
		const newIngredient = { amount: 0, units: "", name: "new ingredient", description: "", index: ingredients.length, sectionId: section.id };
		createIngredientMutation.mutate(newIngredient, {
			onSuccess: (created) => setIngredients([...ingredients, created]),
		});
	}

	function addInstruction() {
		const newInstruction = { description: "", index: instructions.length, sectionId: section.id };
		createInstructionMutation.mutate(newInstruction, {
			onSuccess: (created) => setInstructions([...instructions, created]),
		});
	}

	return (
		<ContentPane>
			<div className="relative mb-4">
				<InputEditor
					Component={SectionTitle}
					styles={sectionTitleStyles}
					className="rounded-xl"
					onSave={(v) => updateSection("name", v)}
				>
					{section.name}
				</InputEditor>

				<DeletionDialog
					title="Delete Section"
					message="Are you sure you wish to delete this section?"
					item={section.name}
					onConfirm={deleteSection}
				>
					<Button
						className="h-1/1 w-12 absolute right-0 top-0 rounded-l-none rounded-r-xl" // border-l-accent
						variant="ghost"
					>
						<XIcon color="red" className="w-6! h-6!" />
					</Button>
				</DeletionDialog>
			</div>

			<TextareaEditor
				Component={SectionDescription}
				styles={sectionDescriptionStyles}
        className="rounded-lg"
				onSave={(v) => updateSection("description", v)}
				placeholder="Section description..."
			>
				{section.description}
			</TextareaEditor>
			<div className="mt-6 flex flex-wrap">
				<div className="grow basis-80 mb-2 bg-blue-600">
					<h3 className="text-center text-xl font-semibold">Ingredients</h3>
					{ingredients.map((ingredient) => (
						<IngredientEditor
							key={ingredient.id}
							ingredient={ingredient}
							onDelete={() => deleteIngredient(ingredient.id)}
						/>
					))}
					<div className="text-center">
						<Button onClick={addIngredient}>Add Ingredient</Button>
					</div>
				</div>
				<div className="grow-2 basis-120 mb-2  bg-green-600">
					<h3 className="text-center text-xl font-semibold">Instructions</h3>
					{instructions.map((instruction) => (
						<InstructionEditor
							key={instruction.id}
							instruction={instruction}
							onDelete={() => deleteInstruction(instruction.id)}
						/>
					))}
					<div className="text-center">
						<Button onClick={addInstruction}>Add Instruction</Button>
					</div>
				</div>
			</div>
		</ContentPane>
	);
}
