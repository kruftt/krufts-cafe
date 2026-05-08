import type { Recipe } from "@schema";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@ui/item";


export function RecipeRow({
	recipe,
}: {
	recipe: Recipe.WithHandle;
}) {
	return (
		<Item
			className="py-1.5 max-w-160"
			variant="outline"
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
	);
}
