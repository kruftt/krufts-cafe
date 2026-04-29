import { prisma } from "@lib/prisma";
import { Model, Recipe } from "@schema";
import { TRPCError } from "@trpc/server";
import { authedProcedure, procedure, router } from "../server";

export const recipeRouter = router({
	get: procedure.input(Model.Id).query(async ({ input }) => {
		return prisma.recipe.findUnique({
			where: { id: input.id },
			include: {
				sections: {
					include: {
						instructions: true,
						ingredients: true,
					},
				},
			},
		});
	}),

	list: procedure.query(async () => {
		return prisma.recipe.findMany();
	}),

	create: authedProcedure
		.input(Recipe.Create)
		.mutation(async ({ input, ctx }) => {
			return prisma.recipe.create({
				data: { ...input, userId: ctx.session.user.id },
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
