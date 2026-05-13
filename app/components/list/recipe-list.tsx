import { Input } from "@components/ui/input";
import { auth } from "@lib/auth-client";
import type { Recipe } from "@schema";
import { ItemGroup } from "@ui/item";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { ListPagination } from "./list-pagination";
import { RecipeRow } from "./recipe-row";

export function RecipeList({
		edit,
		recipes,
		urlQuery,
	}: {
		edit?: boolean;
		recipes: Recipe.WithUser[];
		urlQuery?: string;
	}) {
		const { data: session } = auth.useSession();
		const [query, setQuery] = useState(urlQuery || "");
		const [page, setPage] = useState(1);
		const perPage = 20;

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
			: recipes;

		const total = results.length;
		const sliced = results.slice((page - 1) * perPage, page * perPage);


		return (
			<div className="flex flex-col items-center">
				<Input
					className="max-w-120 mt-2 mb-9 shadow-inner-lg!"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setPage(1);
					}}
					placeholder="Filter by name, tags, or ingredients.."
				/>
				<ItemGroup className="gap-1!">
					{sliced.map((recipe) => (
						<RecipeRow
							key={recipe.id}
							edit={!!edit}
							isLoggedIn={!!session}
							recipe={recipe}
						/>
					))}
				</ItemGroup>
				{total > perPage && (
					<ListPagination
						className="mt-5"
						selected={page}
						select={(n) => setPage(n)}
						total={total}
						perPage={perPage}
					/>
				)}
			</div>
		);
	}
