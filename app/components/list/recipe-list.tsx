import { useTRPC } from "@lib/trpc";
import type { Model, Recipe } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@ui/dialog";
// import { useVirtualizer } from "@tanstack/react-virtual";
import { ItemGroup } from "@ui/item";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useRevalidator } from "react-router";
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
	const revalidator = useRevalidator();
	const [open, setOpen] = useState(false);

	function deleteRecipe(id: number) {
		deleteMutation.mutate({ id },
			{
				onSuccess: () => revalidator.revalidate(),
			},
		);
		setOpen(false);
	}

	return (
		<ItemGroup className="gap-1!">
			{recipes.map((recipe) => (
				<div key={recipe.id} className="flex items-center gap-2">
					<RecipeRow edit={edit} recipe={recipe} />
					{edit && (
							<Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
								<DialogTrigger
									render={
										<Button>
											<Trash2Icon color="red" />
										</Button>
									}
								/>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Delete Recipe</DialogTitle>
										<DialogDescription>
											The following recipe will be permanently deleted:
										</DialogDescription>
									</DialogHeader>
									<div className="text-center">{recipe.name}</div>
									<div className="flex gap-3 justify-around">
										<Button>
											<DialogClose>Cancel</DialogClose>
										</Button>
										<Button variant="destructive" onClick={() => deleteRecipe(recipe.id)}>
											Delete
										</Button>
									</div>
								</DialogContent>
							</Dialog>
					)}
				</div>
			))}
		</ItemGroup>
	);
}
