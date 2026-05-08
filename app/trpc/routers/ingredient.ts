import { prisma } from "@lib/prisma";
import { Ingredient, Model } from "@schema";
import { updateRecipeSearch } from "@services/recipe";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

export const ingredientRouter = router({
	create: authedProcedure.input(Ingredient.Create).mutation(async ({ input, ctx }) => {
		const section = await prisma.section.findUniqueOrThrow({ where: { id: input.sectionId }, select: { recipeId: true } });
		const ingredient = await prisma.ingredient.create({ data: { ...input, userId: ctx.session.user.id } });
		await updateRecipeSearch(section.recipeId);
		return ingredient;
	}),

	update: authedProcedure.input(Ingredient.Partial).mutation(async ({ input, ctx }) => {
		const ingredient = await prisma.ingredient.findUnique({ where: { id: input.id }, include: { section: { select: { recipeId: true } } } });
		if (!ingredient) throw new TRPCError({ code: "NOT_FOUND" });
		if (ingredient.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		const result = await prisma.ingredient.update({ where: { id: input.id }, data: input });
		if (input.name !== undefined) await updateRecipeSearch(ingredient.section.recipeId);
		return result;
	}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const ingredient = await prisma.ingredient.findUnique({ where: { id: input.id }, include: { section: { select: { recipeId: true } } } });
		if (!ingredient) throw new TRPCError({ code: "NOT_FOUND" });
		if (ingredient.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		const result = await prisma.ingredient.delete({ where: { id: input.id } });
		await updateRecipeSearch(ingredient.section.recipeId);
		return result;
	}),

	reorder: authedProcedure.input(Model.Indices).mutation(async ({ input, ctx }) => {
		if (input.length === 0) return;
		const ids = input.map((item) => item.id);
		const count = await prisma.ingredient.count({
			where: { id: { in: ids }, userId: ctx.session.user.id },
		});
		if (count !== input.length) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.$transaction(
			input.map((item) => prisma.ingredient.update({ where: { id: item.id }, data: { index: item.index } }))
		);
	}),
});
