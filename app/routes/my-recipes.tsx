import {ContentHeader} from "@components/content";
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
		<>
			<ContentHeader>
				<h2 className="my-4">My Recipes</h2>
				<CreateButton />
			</ContentHeader>
			<RecipeList edit recipes={loaderData.recipes} />
		</>
	);
}
