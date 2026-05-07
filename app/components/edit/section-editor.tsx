import { ContentPane } from "@components/app";
import { DeletionDialog, InputEditor, TextareaEditor } from "@components/edit";
import { IngredientEditor } from "@components/edit/ingredient-editor";
import { InstructionEditor } from "@components/edit/instruction-editor";
import { useTRPC } from "@lib/trpc";
import type { Section } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SectionEditor({
	section,
	deleteSection,
}: {
	section: Section.Full;
	deleteSection: () => void;
}) {
  const [instructions, setInstructions] = useState(section.instructions);
  const [ingredients, setIngredients] = useState(section.ingredients);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);

	const trpc = useTRPC();
	const updateSectionMutation = useMutation(trpc.section.update.mutationOptions());
	const createIngredientMutation = useMutation(trpc.ingredient.create.mutationOptions());
	const deleteIngredientMutation = useMutation(trpc.ingredient.delete.mutationOptions());
	const createInstructionMutation = useMutation(trpc.instruction.create.mutationOptions());
	const deleteInstructionMutation = useMutation(trpc.instruction.delete.mutationOptions());
  
	function updateSection(field: keyof Section.Model, value: string, onError?: () => void) {
		updateSectionMutation.mutate({ id: section.id, [field]: value }, { onError });
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
	
	// biome-ignore lint: length is the proper dependency
		useEffect(() => {
			instructionsRef.current
				?.querySelector<HTMLInputElement>(":scope div:last-child input")
				?.focus();
		}, [instructions.length]);

		// biome-ignore lint: length is the proper dependency
		useEffect(() => {
			ingredientsRef.current
				?.querySelector<HTMLInputElement>(
					":scope div:last-child > .ingredient input",
				)
				?.focus();
		}, [ingredients.length]);

	return (
		<ContentPane>
			<div className="section__header relative">
				<InputEditor
					value={section.name}
					className="section__title"
					onSave={(v) => updateSection("name", v)}
				/>

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

				<TextareaEditor
					className="section__description"
					onSave={(v) => updateSection("description", v)}
					placeholder="Section description..."
					value={section.description}
				/>
			</div>

			<div className="section__body">
				<div className="ingredients">
					<h3 className="subsection__title">Ingredients</h3>
					<div ref={ingredientsRef}>
						{ingredients.map((ingredient) => (
							<IngredientEditor
								key={ingredient.id}
								ingredient={ingredient}
								onDelete={() => deleteIngredient(ingredient.id)}
							/>
						))}
					</div>
					<div className="text-center  my-4">
						<Button onClick={addIngredient}>Add Ingredient</Button>
					</div>
				</div>

				<div className="instructions">
					<h3 className="subsection__title">Instructions</h3>
					<div ref={instructionsRef}>
						{instructions.map((instruction, i) => (
							<InstructionEditor
								key={instruction.id}
								index={i + 1}
								instruction={instruction}
								onDelete={() => deleteInstruction(instruction.id)}
							/>
						))}
					</div>
					<div className="text-center my-4">
						<Button onClick={addInstruction}>Add Instruction</Button>
					</div>
				</div>
			</div>
		</ContentPane>
	);
}
