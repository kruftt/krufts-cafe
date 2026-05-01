import CreateButton from "@components/recipe/create-button";
import RecipeList from "@components/recipe/recipe-list";
import { requireAuth } from "@lib/auth-loader";
import { prisma } from "@lib/prisma";
import type { Route } from "./+types/my-recipes";


export async function loader({ request }: Route.LoaderArgs) {
	const session = await requireAuth(request);
	// (await session).user.name

	const recipes = await prisma.recipe.findMany({
		where: { userId: session.user.id },
	});

	return { recipes };
}

export default function MyRecipes({ loaderData }: Route.ComponentProps) {
	return (
		<div className="text-center m-4">
			<h2 className="text-2xl mt-8">My Recipes</h2>
			<div className="max-w-200 m-auto">
				<CreateButton />
				<RecipeList edit recipes={loaderData.recipes} />
			</div>
		</div>
	);
}
