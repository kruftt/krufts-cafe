import { ContentContainer, ContentHeader } from "@components/app";
import { RecipeTitleEditor } from "@components/recipe/edit";
import { requireAuth } from "@lib/auth-loader";
import { prisma } from "@lib/prisma";
import { useTRPC } from "@lib/trpc";
import type { Recipe } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "react-router";
import type { Route } from "./+types/edit.$id";

export async function loader({ request, params }: Route.LoaderArgs) {
	const session = await requireAuth(request);
	const id = parseInt(params.id, 10);
	if (Number.isNaN(id)) throw redirect("/my-recipes");

	const recipe = await prisma.recipe.findUnique({
		where: { id },
		include: {
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

export default function RecipeEditor({ loaderData }: Route.ComponentProps) {
	const { recipe } = loaderData;
	const trpc = useTRPC();
	const updateRecipe = useMutation(trpc.recipe.update.mutationOptions());

	function saveRecipe(field: keyof Recipe.Model, value: string) {
		updateRecipe.mutate({ ...recipe, [field]: value });
	}

	return (
		<ContentContainer>
			<ContentHeader>
				<RecipeTitleEditor
					value={recipe.name}
					onSave={(v) => saveRecipe("name", v)}
				></RecipeTitleEditor>
			</ContentHeader>
		</ContentContainer>
	);
}
