import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { InputEditor, TextareaEditor } from "@components/edit";
import {
	RecipeDescription,
	RecipeTitle,
	recipeDescStyles,
	recipeTitleStyles,
} from "@components/view";
import { useTRPC } from "@lib/trpc";
import type { Recipe, Section } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { useState } from "react";
import { SectionEditor } from "./section-editor";

export function RecipeEditor({ recipe }: { recipe: Recipe.Full }) {
	const [sections, setSections] = useState(recipe.sections);
	const trpc = useTRPC();

	const updateRecipeMutation = useMutation({
		...trpc.recipe.update.mutationOptions(),
	});
	
	const createSectionMutation = useMutation({
		...trpc.section.create.mutationOptions(),
	});
	
	const deleteSectionMutation = useMutation({
		...trpc.section.delete.mutationOptions(),
	});

	function updateRecipe(
		field: keyof Recipe.Model,
		value: string,
		onError?: () => void,
	) {
		updateRecipeMutation.mutate({ ...recipe, [field]: value }, { onError });
	}

	function createSection() {
		const index = sections.length;
		createSectionMutation.mutate({
			recipeId: recipe.id,
			name: `Section ${index}`,
			index,
		}, {
			onSuccess: (data) => {
				setSections([...sections, data]);
			}
		})
	}

	function deleteSection(section: Section.Full) {
		setSections(sections.filter((s) => s !== section));
		deleteSectionMutation.mutate({ id: section.id });
	}

	return (
		<ContentContainer>
			<ContentHeader>
				<InputEditor
					Component={RecipeTitle}
					styles={recipeTitleStyles}
					className="rounded-2xl"
					onSave={(v) => updateRecipe("name", v)}
				>
					{recipe.name}
				</InputEditor>
			</ContentHeader>

			<TextareaEditor
				Component={RecipeDescription}
				styles={recipeDescStyles}
				className="rounded-lg"
				onSave={(v) => updateRecipe("description", v)}
				placeholder="Recipe description..."
			>
				{recipe.description}
			</TextareaEditor>

			{sections.map((section) => (
				<SectionEditor
					key={section.id}
					section={section}
					deleteSection={() => deleteSection(section)}
				/>
			))}
			<div className="w-1/1 mt-6 text-center">
				<Button onClick={createSection}>Add Section</Button>
			</div>
		</ContentContainer>
	);
}
