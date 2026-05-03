import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { InputEditor, TextareaEditor } from "@components/edit";
import {
	RecipeDescription,
	RecipeTitle,
	recipeDescStyles,
	recipeTitleStyles,
} from "@components/view";
import { useTRPC } from "@lib/trpc";
import type { Recipe } from "@schema";
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

	function updateRecipe(
		field: keyof Recipe.Model,
		value: string,
		onError?: () => void,
	) {
		updateRecipeMutation.mutate({ ...recipe, [field]: value }, { onError });
	}

	const createSectionMutation = useMutation({
		...trpc.section.create.mutationOptions(),
	});

	function createSection() {
		createSectionMutation.mutate({
			recipeId: recipe.id,
			index: sections.length,
		}, {
			onSuccess: (data) => {
				sections.push(data);
			}
		})
	}

	return (
		<ContentContainer>
			<ContentHeader>
				<InputEditor
					Component={RecipeTitle}
					className={recipeTitleStyles}
					onSave={(v) => updateRecipe("name", v)}
				>
					{recipe.name}
				</InputEditor>
			</ContentHeader>
			<ContentPane>
				<TextareaEditor
					Component={RecipeDescription}
					className={recipeDescStyles}
					onSave={(v) => updateRecipe("description", v)}
					placeholder="Recipe description..."
				>
					{recipe.description}
				</TextareaEditor>
			</ContentPane>
			{
				sections.map(section => <SectionEditor key={section.id} section={section} />)
			}
			<div className="w-1/1 mt-6 text-center">
				<Button onClick={createSection}>Add Section</Button>
			</div>
		</ContentContainer>
	);
}
