import { prisma } from "@lib/prisma";
import { Id, Ingredient } from "@schema";
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

	delete: authedProcedure.input(Id).mutation(async ({ input, ctx }) => {
		const ingredient = await prisma.ingredient.findUnique({ where: { id: input.id } });
		if (!ingredient) throw new TRPCError({ code: "NOT_FOUND" });
		if (ingredient.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.ingredient.delete({ where: { id: input.id } });
	}),
});
