import { prisma } from "@lib/prisma";
import { Ingredient, Model } from "@schema";
import { updateRecipeSearch } from "@services/recipe";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { authedProcedure, router } from "../server";

const ownerSelect = {
	group: {
		select: {
			recipeId: true,
			recipe: {
				select: { userId: true },
			},
		},
	},
};

export const ingredientRouter = router({
	create: authedProcedure
		.input(Ingredient.Create)
		.mutation(async ({ input, ctx }) => {
			const group = await prisma.ingredientGroup.findUniqueOrThrow({
				where: { id: input.groupId },
				select: {
					recipe: {
						select: { userId: true },
					},
				},
			});

			if (group.recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });

			return prisma.ingredient.create({ data: input });
		}),

	update: authedProcedure
		.input(Ingredient.Update.extend({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const ingredient = await prisma.ingredient.findUniqueOrThrow({
				where: { id: input.id },
				select: ownerSelect,
			});

			if (ingredient.group.recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });

			const result = await prisma.ingredient.update({
				where: { id: input.id },
				data: input,
			});

			if (input.name !== undefined)
				await updateRecipeSearch(ingredient.group.recipeId);

			return result;
		}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const ingredient = await prisma.ingredient.findUniqueOrThrow({
			where: input,
			select: ownerSelect,
		});

		if (ingredient.group.recipe.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });

		const result = await prisma.ingredient.delete({ where: { id: input.id } });

		await updateRecipeSearch(ingredient.group.recipeId);
		return result;
	}),
});
