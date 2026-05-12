import { RecipeEditor } from "@components/edit";
import { requireAuth } from "@lib/auth-loader";
import { prisma } from "@lib/prisma";
import { redirect } from "react-router";
import type { Route } from "./+types/edit.$id";

export async function loader({ request, params }: Route.LoaderArgs) {
	const session = await requireAuth(request);
	const id = parseInt(params.id, 10);
	if (Number.isNaN(id)) throw redirect("/my-recipes");

	const recipe = await prisma.recipe.findUnique({
		where: { id },
		include: {
			user: {
				select: {
					name: true,
				}
			},
			sections: {
				orderBy: { index: "asc" },
				include: {
					ingredients: { orderBy: { index: "asc" } },
					instructions: { orderBy: { index: "asc" } },
				},
			},
		},
	});

	if (!recipe) throw redirect("/my-recipes");
	if (recipe.userId !== session.user.id) throw redirect("/my-recipes");

	return { recipe };
}

export default function EditPage({ loaderData }: Route.ComponentProps) {
	return (
		<RecipeEditor recipe={loaderData.recipe} />
	);
}
