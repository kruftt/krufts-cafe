import { prisma } from "@lib/prisma";
import { Ingredient, Model } from "@schema";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

export const ingredientRouter = router({
	create: authedProcedure.input(Ingredient.Create).mutation(async ({ input, ctx }) => {
		return prisma.ingredient.create({ data: { ...input, userId: ctx.session.user.id } });
	}),

	update: authedProcedure.input(Ingredient.Model).mutation(async ({ input, ctx }) => {
		const ingredient = await prisma.ingredient.findUnique({ where: { id: input.id } });
		if (!ingredient) throw new TRPCError({ code: "NOT_FOUND" });
		if (ingredient.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.ingredient.update({ where: { id: input.id }, data: input });
	}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const ingredient = await prisma.ingredient.findUnique({ where: { id: input.id } });
		if (!ingredient) throw new TRPCError({ code: "NOT_FOUND" });
		if (ingredient.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.ingredient.delete({ where: { id: input.id } });
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
