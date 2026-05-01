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
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@ui/item";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useRevalidator } from "react-router";

export default function RecipeItem({
	edit,
	recipe,
}: {
	edit: boolean;
	recipe: Recipe.Model;
}) {
	const trpc = useTRPC();
	const deleteMutation = useMutation(trpc.recipe.delete.mutationOptions());
  const revalidator = useRevalidator();
  const [open, setOpen] = useState(false);

  function deleteRecipe() {
    deleteMutation.mutate({ id: recipe.id }, {
      onSuccess: () => revalidator.revalidate()
    });
    setOpen(false);
  }

	return (
		<Item className="bg-gray-900 py-1.5" variant="outline" size="xs">
			{edit && (
				<Button>
					<EditIcon />
				</Button>
			)}
			<ItemContent>
				<ItemTitle>{recipe.name}</ItemTitle>
				<ItemDescription>{recipe.description}</ItemDescription>
			</ItemContent>
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
							<Button variant="destructive" onClick={deleteRecipe}>
								Delete
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</Item>
	);
}
