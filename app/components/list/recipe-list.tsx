import { auth } from "@lib/auth-client";
import type { Recipe } from "@schema";
import { ItemGroup } from "@ui/item";
import { RecipeRow } from "./recipe-row";

export function RecipeList({
	edit,
	recipes,
}: {
	edit?: boolean;
	recipes: Recipe.WithHandle[];
}) {
	const { data: session } = auth.useSession();

	return (
		<ItemGroup className="gap-1!">
			{recipes.map((recipe) => (
				<RecipeRow key={recipe.id} edit={!!edit} isLoggedIn={!!session} recipe={recipe} />
			))}
		</ItemGroup>
	);
}
