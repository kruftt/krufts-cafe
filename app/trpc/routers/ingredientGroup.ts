import { prisma } from "@lib/prisma";
import { IngredientGroup, Model } from "@schema";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { authedProcedure, router } from "../server";

export const ingredientGroupRouter = router({
	create: authedProcedure
		.input(IngredientGroup.Create)
		.mutation(async ({ input, ctx }) => {
			const recipe = await prisma.recipe.findUnique({
				where: { id: input.recipeId },
				select: { userId: true },
			});
			if (!recipe) throw new TRPCError({ code: "NOT_FOUND" });
			if (recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });
      
			return prisma.ingredientGroup.create({
				data: input,
				include: { ingredients: true },
			});
		}),

	update: authedProcedure
		.input(IngredientGroup.Update.extend({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const group = await prisma.ingredientGroup.findUnique({
				where: { id: input.id },
				select: { recipe: { select: { userId: true } } },
			});
			if (!group) throw new TRPCError({ code: "NOT_FOUND" });
			if (group.recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });

			return prisma.ingredientGroup.update({ where: { id: input.id }, data: input });
		}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const group = await prisma.ingredientGroup.findUnique({
			where: input,
			select: { recipe: { select: { userId: true } } },
		});
		if (!group) throw new TRPCError({ code: "NOT_FOUND" });
		if (group.recipe.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });

		return prisma.ingredientGroup.delete({ where: { id: input.id } });
	}),
});
