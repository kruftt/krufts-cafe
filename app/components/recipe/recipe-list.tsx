import type { Recipe } from "@schema";
// import { useVirtualizer } from "@tanstack/react-virtual";
import { ItemGroup } from "@ui/item";
import RecipeItem from "./recipe-item";

// TODO: change to @tanstack/react-virtual
export default function RecipeList({ edit, recipes }: { edit: boolean, recipes: Recipe.Model[] }) {

  // recipes = [
	// 		{
	// 			name: "Tomato Soup",
	// 			slug: "tomato-soup",
	// 			description: "A delicious tomato soup.",
	// 			id: 1,
	// 			userId: "stets",
	// 		},
	// 		{
	// 			name: "Breakfast Burritos",
	// 			slug: "breakfast-burritos",
	// 			description: "What's not to love? A California classic.",
	// 			id: 1,
	// 			userId: "stets",
	// 		},
	// 	];

	return (
		<ItemGroup className="gap-1!">
			{recipes.map((recipe) => (
				<RecipeItem key={recipe.id} edit={edit} recipe={recipe} />
			))}
		</ItemGroup>
	);
}
