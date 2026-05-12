import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { CreateRecipeButton, RecipeList } from "@components/list";
import { requireAuth } from "@lib/auth-loader";
import { prisma } from "@lib/prisma";
import type { Route } from "./+types/my-recipes";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await requireAuth(request);
	// (await session).user.name

	const recipes = await prisma.recipe.findMany({
		where: { userId: session.user.id },
		include: { user: { select: {
			handle: true,
			name: true,
		 } } }
	});

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
