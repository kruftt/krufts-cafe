import { DeletionDialog } from "@components/edit";
import { useTRPC } from "@lib/trpc";
import type { Recipe } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { ItemGroup } from "@ui/item";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { RecipeRow } from "./recipe-row";

export function RecipeList({
	edit,
	recipes,
}: {
	edit?: boolean;
	recipes: Recipe.WithHandle[];
}) {
	const navigate = useNavigate();
	const revalidator = useRevalidator();
	const trpc = useTRPC();
	const deleteMutation = useMutation(trpc.recipe.delete.mutationOptions());

	function deleteRecipe(recipe: Recipe.Model) {
		deleteMutation.mutate(
			{ id: recipe.id },
			{
				onSuccess: revalidator.revalidate,
				// onSuccess: () => setList(list.filter((r) => r !== recipe)),
			},
		);
	}

	return (
		<ItemGroup className="gap-1!">
			{recipes.map((recipe) => (
				<div key={recipe.id} className="flex justify-center items-center gap-2">
					{edit && (
						<Button onClick={() => navigate(`/edit/${recipe.id}`)}>
							<EditIcon />
						</Button>
					)}
					<RecipeRow recipe={recipe} />
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
