import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { RecipeList } from "@components/list";
import { requireAuth } from "@lib/auth-loader";
import { prisma } from "@lib/prisma";
import type { Route } from "./+types/bookmarks";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await requireAuth(request);

	const bookmarks = await prisma.bookmark.findMany({
		where: { userId: session.user.id },
		include: {
			recipe: {
				select: {
					id: true,
					name: true,
					tags: true,
					slug: true,
					search: true,
					description: true,
					intro: true,
					userId: true,
					user: { select: { handle: true } },
				},
			},
		},
	});

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
