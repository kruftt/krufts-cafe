import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { CreateRecipeButton, RecipeList } from "@components/list";
import { requireAuth } from "@lib/auth-loader";
import { findRecipes } from "@services/recipe";
import type { Route } from "./+types/my-recipes";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await requireAuth(request);
	const recipes = await findRecipes({ userId: session.user.id });
	return { recipes };
}

export default function MyRecipes({ loaderData }: Route.ComponentProps) {
	return (
		<ContentContainer>
			<ContentHeader className="userpage__header">
				<h2 className="mb-6">My Recipes</h2>
				<CreateRecipeButton />
			</ContentHeader>
			<ContentPane className="recipe__list">
				<RecipeList edit recipes={loaderData.recipes} />
			</ContentPane>
		</ContentContainer>
	);
}
