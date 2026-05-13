import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { RecipeList } from "@components/list";
import { requireAuth } from "@lib/auth-loader";
import { findBookmarkedRecipes } from "@services/recipe";
import type { Route } from "./+types/bookmarks";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await requireAuth(request);
	const bookmarks = await findBookmarkedRecipes({ userId: session.user.id });
	return { recipes: bookmarks.map((b) => b.recipe) };
}

export default function BookmarksPage({ loaderData }: Route.ComponentProps) {
	const { recipes } = loaderData;

	return (
		<ContentContainer>
			<ContentHeader className="userpage__header">
				<h2>Bookmarks</h2>
			</ContentHeader>
			<ContentPane className="recipe__list">
				<RecipeList recipes={recipes} />
			</ContentPane>
		</ContentContainer>
	);
}
