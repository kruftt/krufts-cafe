import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { InputEditor, TagEditor, TextareaEditor } from "@components/edit";
import type { ProcedureOptions } from "@hooks";
import { useTRPC } from "@lib/trpc";
import { Recipe, type Section } from "@schema";
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

	function updateRecipe(field: keyof Recipe.Model) {
		return (value: string | string[], options: ProcedureOptions) =>
			updateRecipeMutation.mutate(
				{ id: recipe.id, [field]: value },
				{
					onError: (ctx) => options.onError(ctx.message),
					onSuccess: options.onSuccess,
				}
			);
	}

	function createSection() {
		const last = sections[sections.length - 1];
		const index = last ? last.index + 1 : 0;

		createSectionMutation.mutate(
			{
				recipeId: recipe.id,
				name: `Section ${index}`,
				index,
			},
			{
				onSuccess: (data) => {
					setSections([...sections, data]);
				},
			},
		);
	}

	function deleteSection(section: Section.Full) {
		setSections(sections.filter((s) => s !== section));
		deleteSectionMutation.mutate({ id: section.id });
	}

	return (
		<ContentContainer>
			<ContentHeader>
				<InputEditor
					value={recipe.name}
					className="recipe__title"
					styles="rounded-2xl"
					onSave={updateRecipe("name")}
					validate={(v) => Recipe.Name.safeParse(v).error?.issues[0]?.message}
					// aria-invalid
				/>

				<InputEditor
					className="recipe__description"
					onSave={updateRecipe("description")}
					placeholder="Recipe description..."
					value={recipe.description}
				/>

				<TagEditor tags={recipe.tags} onSave={updateRecipe("tags")} />
			</ContentHeader>

			<ContentPane>
				<TextareaEditor
					onSave={updateRecipe("intro")}
					placeholder="Recipe Introduction..."
					value={recipe.intro}
				/>
			</ContentPane>

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
