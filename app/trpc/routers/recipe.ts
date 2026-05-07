import { prisma } from "@lib/prisma";
import { Model, Recipe } from "@schema";
import { newRecipeName } from "@services/recipe";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

function toSlug(name: string) {
	return name
		.normalize("NFD") // decompose "é" into "e" + combining accent
		.replace(/\p{M}/gu, "") // strip combining marks (the accents)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric runs with hyphens
		.replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}

export const recipeRouter = router({
	create: authedProcedure.mutation(async ({ ctx }) => {
		const name = await newRecipeName(ctx.session.user.id);

		return prisma.recipe.create({
			data: {
				name,
				slug: null,
				userId: ctx.session.user.id,
			},
		});
	}),

	update: authedProcedure
		.input(Recipe.Partial)
		.mutation(async ({ input, ctx }) => {
			const recipe = await prisma.recipe.findUnique({
				where: { id: input.id },
			});
			if (!recipe) throw new TRPCError({ code: "NOT_FOUND" });
			if (recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });

			// if renaming, validate format, generate new slug, attempt to update
			const data = {...input};

			if (input.name) {
				const parse = Recipe.Name.safeParse(input.name);
				if (parse.error) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: parse.error.issues[0]?.message,
					});
				}
				data.slug = toSlug(input.name);
			}

			return prisma.recipe.update({ where: { id: input.id }, data });
		}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const recipe = await prisma.recipe.findUnique({ where: { id: input.id } });
		if (!recipe) throw new TRPCError({ code: "NOT_FOUND" });
		if (recipe.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.recipe.delete({ where: { id: input.id } });
	}),
});
