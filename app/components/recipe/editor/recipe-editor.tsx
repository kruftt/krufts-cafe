import { Container, Header, Panel } from "@components/app";
import { InputEditor, TextareaEditor } from "@components/controls";
import { Button, buttonVariants } from "@components/ui/button";
import { useRecipeCache } from "@hooks";
import { getNextIndex } from "@lib/utils";
import type { RecipeData } from "@services/recipe";
import { CheckSquareIcon, LinkIcon, SquareIcon } from "lucide-react";
import { IngredientGroupEditor } from "./ingredient-group-editor";
import { StepEditor } from "./step-editor";
import { TagsEditor } from "./tags-editor";

export function RecipeEditor({ recipe }: { recipe: RecipeData }) {
	const { updateRecipe, updateRecipeField, addIngredientGroup, addStep } =
		useRecipeCache(recipe.id);

	function createIngredientGroup() {
		addIngredientGroup.mutate({
			recipeId: recipe.id,
			index: getNextIndex(recipe.ingredientGroups),
		}, {
			onSuccess() {
				setTimeout(() => {
					const groups =
						document.querySelectorAll<HTMLInputElement>(
							".ingredient_group input",
						);
					const last = groups.item(groups.length - 1);
					if (last) last.focus();
				}, 0);
			}
		});
	}

	function createStep() {
		addStep.mutate({
			recipeId: recipe.id,
			index: getNextIndex(recipe.steps)
		}, {
			onSuccess() {
				setTimeout(() => {
					const stepTitles = document.querySelectorAll<HTMLInputElement>(".panel__title input");
					const last = stepTitles.item(stepTitles.length - 1);
					if (last) last.focus()
				}, 0);
			},
		});
	}

	return (
		<Container>
			<Header.Section>
				<Header.Item>
					<div className="flex gap-1 justify-center">
						<Button
							aria-label="Toggle published"
							size="sm"
							variant="outline"
							onClick={() =>
								updateRecipe.mutate({
									id: recipe.id,
									published: !recipe.published,
								})
							}
						>
							{recipe.published ? (
								<>
									<CheckSquareIcon />
									Published
								</>
							) : (
								<>
									<SquareIcon />
									Unpublished
								</>
							)}
						</Button>
						<a 
							href={`/recipes/${recipe.user.handle}/${recipe.slug}`}
							className={`${buttonVariants({ variant: 'outline', size: 'sm'})}`}>
							<LinkIcon />
							Live
						</a>
					</div>
				</Header.Item>

				<Header.Title>
					<InputEditor
						value={recipe.name}
						className="recipe__title"
						inputStyle="rounded-2xl"
						onSave={updateRecipeField(recipe.id, "name")}
						// aria-invalid
					/>
					<div className="recipe__author">By {recipe.user.name}</div>
				</Header.Title>

				<TagsEditor tags={recipe.tags} />

				<Header.Item className="recipe__duration">
					<div>
						<div className="recipe__duration_title">Prep</div>
						<div className="recipe__duration_entry">
							<InputEditor
								onSave={updateRecipeField(recipe.id, "prepTime")}
								value={recipe.prepTime}
								resize
							/>
							<span>min</span>
						</div>
					</div>
					<div className="border-l" />
					<div>
						<div className="recipe__duration_title">Cook</div>
						<div className="recipe__duration_entry">
							<InputEditor
								onSave={updateRecipeField(recipe.id, "cookTime")}
								value={recipe.cookTime}
								resize
							/>
							<span>min</span>
						</div>
					</div>
					<div className="border-l" />
					<div>
						<div className="recipe__duration_title">Total</div>
						<div className="recipe__duration_entry">
							{`${recipe.prepTime + recipe.cookTime} min`}
						</div>
					</div>
				</Header.Item>
			</Header.Section>

			<Panel.Section>
				<Panel.Item>
					<TextareaEditor
						className="recipe__intro"
						onSave={updateRecipeField(recipe.id, "intro")}
						placeholder="Recipe Introduction..."
						value={recipe.intro}
					/>
				</Panel.Item>
			</Panel.Section>

			<Panel.Section>
				<Panel.Item className="ingredient_groups">
					{recipe.ingredientGroups.map((group) => (
						<IngredientGroupEditor key={group.id} group={group} />
					))}
				</Panel.Item>

				<Panel.Item className="text-center">
					<Button onClick={createIngredientGroup}>Add Ingredient Group</Button>
				</Panel.Item>
			</Panel.Section>

			{recipe.steps.map((step, i) => (
				<StepEditor key={step.id} index={i + 1} step={step} />
			))}

			<div className="w-1/1 mt-6 text-center">
				<Button onClick={createStep}>Add Step</Button>
			</div>
		</Container>
	);
}
