import type { Recipe } from "@schema";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@ui/item";

export default function RecipeItem({ recipe }: { recipe: Recipe.Model }) {
	return (
    <Item className="bg-gray-900 py-1.5" variant="outline" size="xs">
      <ItemContent>
        <ItemTitle>{ recipe.name }</ItemTitle>
        <ItemDescription>{ recipe.description }</ItemDescription>
      </ItemContent>
    </Item>
  );
}
