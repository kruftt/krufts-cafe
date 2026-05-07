import { ContentContainer, ContentHeader } from "@components/app";
import { CreateRecipeButton, RecipeList } from "@components/list";
import { prisma } from "@lib/prisma";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
	const recipes = await prisma.recipe.findMany({
    include: { user: { select: { handle: true }}}
  });

	return { recipes };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<ContentContainer>
			<ContentHeader>
				<h1>
					Environment:
					{process.env.NODE_ENV === "production"
						? "production"
						: "development"}
				</h1>
			</ContentHeader>
			<RecipeList recipes={loaderData.recipes} />
		</ContentContainer>
	);
}