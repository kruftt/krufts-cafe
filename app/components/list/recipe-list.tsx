import { DeletionDialog } from "@components/edit";
import { useTRPC } from "@lib/trpc";
import type { Recipe } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { ItemGroup } from "@ui/item";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { RecipeRow } from "./recipe-row";

// TODO: change to @tanstack/react-virtual
export function RecipeList({
	edit,
	recipes,
}: {
	edit: boolean;
	recipes: Recipe.Model[];
}) {
	const trpc = useTRPC();
	const deleteMutation = useMutation(trpc.recipe.delete.mutationOptions());

	const [list, setList] = useState(recipes);

	function deleteRecipe(recipe: Recipe.Model) {
		deleteMutation.mutate(
			{ id: recipe.id },
			{
				onSuccess: () => setList(list.filter((r) => r !== recipe)),
			},
		);
	}

	return (
		<ItemGroup className="gap-1!">
			{list.map((recipe) => (
				<div key={recipe.id} className="flex items-center gap-2">
					<RecipeRow edit={edit} recipe={recipe} />
					{edit && (
						<DeletionDialog
							title="Delete Recipe"
							message="The following recipe will be deleted:"
							item={recipe.name}
							onConfirm={() => deleteRecipe(recipe)}
						>
							<Button>
								<Trash2Icon color="red" />
							</Button>
						</DeletionDialog>
					)}
				</div>
			))}
		</ItemGroup>
	);
}
