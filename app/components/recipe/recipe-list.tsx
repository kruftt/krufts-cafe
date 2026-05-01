import type { Recipe } from "@schema";
// import { useVirtualizer } from "@tanstack/react-virtual";
import { ItemGroup } from "@ui/item";
import RecipeRow from "./recipe-row";

// TODO: change to @tanstack/react-virtual
export default function RecipeList({ edit, recipes }: { edit: boolean, recipes: Recipe.Model[] }) {
	return (
		<ItemGroup className="gap-1!">
			{recipes.map((recipe) => (
				<RecipeRow key={recipe.id} edit={edit} recipe={recipe} />
			))}
		</ItemGroup>
	);
}
