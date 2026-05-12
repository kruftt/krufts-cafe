import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { CreateRecipeButton, RecipeList } from "@components/list";
import { Input } from "@components/ui/input";
import { prisma } from "@lib/prisma";
// import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
	const recipes = await prisma.recipe.findMany({
		include: { user: { select: {
			handle: true,
			name: true,
		} } },
	});

	const url = new URL(request.url);
	const urlQuery = url.searchParams.get('q') ?? "";

	return { recipes, urlQuery };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { recipes, urlQuery } = loaderData;
	// const [query, setQuery] = useState(urlQuery);

	// const fuse = useMemo(
	// 	() =>
	// 		new Fuse(recipes, {
	// 			keys: ["search"],
	// 			// useTokenSearch: true,
	// 			threshold: 0.6,
	// 			shouldSort: true,
	// 		}),
	// 	[recipes],
	// );

	// const results = query
	// 	? fuse.search(query, { limit: 30 }).map((r) => r.item)
	// 	: recipes.slice(0, 30);

	return (
		<ContentContainer>
			<ContentHeader>
				{/* <Input
					className="max-w-120 my-6 mb-4"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Recipes, tags, ingredients..."
				/> */}
			</ContentHeader>
			<ContentPane className="recipe__list">
				<RecipeList recipes={recipes} />
			</ContentPane>
		</ContentContainer>
	);
}
