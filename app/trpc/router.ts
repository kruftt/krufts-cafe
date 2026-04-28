import { prisma } from "@lib/prisma";
import { Id, Recipe } from "@schema";
// import * as z from "zod";
import { procedure, router } from "./server";

export const trpcRouter = router({
	recipeById: procedure.input(Id).query(async ({ input }) => {
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

	recipeList: procedure.query(async () => {
		const recipes: Recipe.Model[] = [];
		return recipes;
	}),

	createRecipe: procedure.input(Recipe.Create).mutation(async ({ input }) => {
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

	updateRecipe: procedure.input(Recipe.Update).mutation(async ({ input }) => {
		const { id, steps, ...recipe } = input;
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

export type TrpcRouter = typeof trpcRouter;


