import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { RecipeList } from "@components/list";
import { findRecipes } from "@services/recipe";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
	const recipes = await findRecipes();
	const url = new URL(request.url);
	const urlQuery = url.searchParams.get("q") ?? "";
	return { recipes, urlQuery };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { recipes, urlQuery } = loaderData;

	return (
		<ContentContainer>
			<ContentHeader></ContentHeader>
			<ContentPane className="recipe__list">
				<RecipeList recipes={recipes} urlQuery={urlQuery} />
			</ContentPane>
		</ContentContainer>
	);
}
