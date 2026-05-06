import { prisma } from "@lib/prisma";
import { Model, Recipe } from "@schema";
import { newRecipeName } from "@services/recipe";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

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
		.input(Recipe.Model)
		.mutation(async ({ input, ctx }) => {
			const recipe = await prisma.recipe.findUnique({
				where: { id: input.id },
			});
			if (!recipe) throw new TRPCError({ code: "NOT_FOUND" });
			if (recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });
			return prisma.recipe.update({ where: { id: input.id }, data: input });
		}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const recipe = await prisma.recipe.findUnique({ where: { id: input.id } });
		if (!recipe) throw new TRPCError({ code: "NOT_FOUND" });
		if (recipe.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.recipe.delete({ where: { id: input.id } });
	}),
});
