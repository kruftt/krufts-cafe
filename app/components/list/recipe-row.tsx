import { DeletionDialog } from "@components/edit";
import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useBookmarks } from "@hooks/bookmark";
import { usePins } from "@hooks/pins";
import { useTRPC } from "@lib/trpc";
import type { Recipe } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@ui/item";
import {
	BookmarkIcon,
	EditIcon,
	MenuIcon,
	PinIcon,
	Trash2Icon,
} from "lucide-react";
import { useNavigate, useRevalidator } from "react-router";

export function RecipeRow({
	edit,
	isLoggedIn,
	recipe,
}: {
	edit: boolean;
	isLoggedIn: boolean;
	recipe: Recipe.WithHandle;
}) {
	const navigate = useNavigate();
	const revalidator = useRevalidator();
	const trpc = useTRPC();
	const { isPinned, togglePin } = usePins();
	const { isBookmarked, toggleBookmark } = useBookmarks();
	const pinned = isPinned(recipe.id);
	const bookmarked = isBookmarked(recipe.id);

	const deleteMutation = useMutation(trpc.recipe.delete.mutationOptions());

	function deleteRecipe(recipe: Recipe.Model) {
		deleteMutation.mutate(
			{ id: recipe.id },
			{ onSuccess: revalidator.revalidate },
		);
	}

	return (
		<div className="flex justify-center items-start gap-2">
			<div className="flex not-sm:hidden">
				<Button variant="ghost" onClick={() => togglePin(recipe)}>
					<PinIcon fill={pinned ? "currentColor" : "none"} />
				</Button>
				{isLoggedIn && (
					<Button variant="ghost" onClick={() => toggleBookmark(recipe.id)}>
						<BookmarkIcon fill={bookmarked ? "currentColor" : "none"} />
					</Button>
				)}
				{edit && (
					<Button
						variant="ghost"
						onClick={() => navigate(`/edit/${recipe.id}`)}
					>
						<EditIcon />
					</Button>
				)}
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger
					className="sm:hidden"
					render={<Button variant="ghost" />}
				>
					<MenuIcon />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="sm:hidden">
					{edit && (
						<DropdownMenuItem onClick={() => navigate(`/edit/${recipe.id}`)}>
							<EditIcon />
							Edit
						</DropdownMenuItem>
					)}
					<DropdownMenuItem onClick={() => togglePin(recipe)}>
						<PinIcon fill={pinned ? "currentColor" : "none"} />
						{pinned ? "Unpin" : "Pin"}
					</DropdownMenuItem>
					{isLoggedIn && (
						<DropdownMenuItem onClick={() => toggleBookmark(recipe.id)}>
							<BookmarkIcon fill={bookmarked ? "currentColor" : "none"} />
							{bookmarked ? "Remove Bookmark" : "Bookmark"}
						</DropdownMenuItem>
					)}
					{edit && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive">
								<Trash2Icon />
								Delete
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			<Item
				className="py-1.5"
				variant="default"
				render={
					<a href={`/recipes/${recipe.user.handle}/${recipe.slug}`}>
						<ItemContent>
							<ItemTitle>{recipe.name}</ItemTitle>
							<ItemDescription>{recipe.description}</ItemDescription>
						</ItemContent>
					</a>
				}
				size="xs"
			/>
			{edit && (
				<div className="flex not-sm:hidden">
					<DeletionDialog
						title="Delete Recipe"
						message="The following recipe will be deleted:"
						item={recipe.name}
						onConfirm={() => deleteRecipe(recipe)}
					>
						<Button variant="ghost">
							<Trash2Icon color="red" />
						</Button>
					</DeletionDialog>
				</div>
			)}
		</div>
	);
}
