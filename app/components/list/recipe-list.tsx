import { Input } from "@components/ui/input";
import { auth } from "@lib/auth-client";
import type { Recipe } from "@schema";
import { ItemGroup } from "@ui/item";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { RecipeRow } from "./recipe-row";

export function RecipeList({
	edit,
	recipes,
}: {
	edit?: boolean;
	recipes: Recipe.WithUser[];
}) {
	const { data: session } = auth.useSession();
	const [query, setQuery] = useState("");

	const fuse = useMemo(
		() =>
			new Fuse(recipes, {
				keys: ["search"],
				// useTokenSearch: true,
				threshold: 0.6,
				shouldSort: true,
			}),
		[recipes],
	);

	const results = query
		? fuse.search(query, { limit: 30 }).map((r) => r.item)
		: recipes.slice(0, 30);

	return (
		<>
			<Input
				className="max-w-120 my-6 mb-4"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Recipes, tags, ingredients..."
			/>
			<ItemGroup className="gap-1!">
				{results.map((recipe) => (
					<RecipeRow
						key={recipe.id}
						edit={!!edit}
						isLoggedIn={!!session}
						recipe={recipe}
					/>
				))}
			</ItemGroup>
		</>
	);
}
