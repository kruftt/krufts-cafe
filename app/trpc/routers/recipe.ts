import { prisma } from "@lib/prisma";
import { Model, Recipe } from "@schema";
import { TRPCError } from "@trpc/server";
import { Prisma } from "prisma/generated/client";
import { authedProcedure, router } from "../server";

export const recipeRouter = router({
	create: authedProcedure
		.input(Recipe.Create)
		.mutation(async ({ input, ctx }) => {
			const slug = input.name.toLowerCase().replace(" ", "-");
			try {
				return await prisma.recipe.create({
					data: { ...input, slug, userId: ctx.session.user.id },
				});
			} catch (e) {
				if (
					e instanceof Prisma.PrismaClientKnownRequestError &&
					e.code === "P2002"
				) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "You already have a recipe with that name",
					});
				}
				throw e;
			}
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
