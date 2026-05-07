import { ContentContainer, ContentHeader } from "@components/app";
import { CreateRecipeButton, RecipeList } from "@components/list";
import { requireAuth } from "@lib/auth-loader";
import { prisma } from "@lib/prisma";
import type { Route } from "./+types/my-recipes";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await requireAuth(request);
	// (await session).user.name

	const recipes = await prisma.recipe.findMany({
		where: { userId: session.user.id },
		include: { user: { select: { handle: true } } }
	});

	return { recipes };
}

export default function MyRecipes({ loaderData }: Route.ComponentProps) {
	return (
		<ContentContainer>
			<ContentHeader>
				<h2 className="my-4">My Recipes</h2>
				<CreateRecipeButton />
			</ContentHeader>
			<RecipeList edit recipes={loaderData.recipes} />
		</ContentContainer>
	);
}
