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
	edit,
	recipe,
}: {
	edit: boolean;
	recipe: Recipe.Model;
}) {
	return (
		<Item
			className="py-1.5"
			variant="outline"
			render={
				<a href={edit ? `/edit/${recipe.id}` : `/recipes/${recipe.slug}`}>
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
