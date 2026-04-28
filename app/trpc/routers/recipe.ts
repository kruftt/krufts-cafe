import { prisma } from "@lib/prisma";
import { Id, Recipe } from "@schema";
import { TRPCError } from "@trpc/server";
import { authedProcedure, procedure, router } from "../server";

export const recipeRouter = router({
	get: procedure.input(Id).query(async ({ input }) => {
		prisma.recipe.findUnique({
			where: { id: input.id },
			include: {
				steps: {
					include: {
						instructions: true,
					},
				},
			},
		});
	}),

	list: procedure.query(async () => {
		const recipes: Recipe.Model[] = [];
		return recipes;
	}),

	create: authedProcedure.input(Recipe.Create).mutation(async ({ input }) => {
		const { steps, ...recipe } = input;
		return prisma.recipe.create({
			data: {
				...recipe,
				steps: {
					create: steps.map(({ ingredients, instructions, ...step }) => ({
						...step,
						ingredients: { create: ingredients },
						instructions: { create: instructions },
					})),
				},
			},
		});
	}),

	update: authedProcedure.input(Recipe.Update).mutation(async ({ input, ctx }) => {
		const { id, steps, ...recipe } = input;

		const existing = await prisma.recipe.findUnique({
			where: { id },
			include: { author: true },
		});
		if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
		if (existing.author.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });

		return prisma.$transaction([
			prisma.ingredient.deleteMany({ where: { step: { recipeId: id } } }),
			prisma.instruction.deleteMany({ where: { step: { recipeId: id } } }),
			prisma.step.deleteMany({ where: { recipeId: id } }),
			prisma.recipe.update({
				where: { id },
				data: {
					...recipe,
					steps: {
						create: steps.map(({ ingredients, instructions, ...step }) => ({
							...step,
							ingredients: { create: ingredients },
							instructions: { create: instructions },
						})),
					},
				},
			}),
		]);
	}),
});
