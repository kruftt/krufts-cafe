import { prisma } from "@lib/prisma";
import { Model, Step } from "@schema";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { authedProcedure, router } from "../server";

export const stepRouter = router({
	create: authedProcedure
		.input(Step.Create)
		.mutation(async ({ input, ctx }) => {
			const recipe = await prisma.recipe.findUnique({
				where: { id: input.recipeId },
				select: { userId: true }
			});

			if (!recipe) throw new TRPCError({ code: "NOT_FOUND" });
			if (recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });

			return prisma.step.create({ data: input, select: { id: true } });
		}),

	update: authedProcedure
		.input(Step.Update.extend({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const step = await prisma.step.findUnique({
				where: { id: input.id },
				select: { recipe: { select: { userId: true } } },
			});
			if (!step) throw new TRPCError({ code: "NOT_FOUND" });
			if (step.recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });

			return prisma.step.update({ where: { id: input.id }, data: input });
		}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const step = await prisma.step.findUnique({
			where: input,
			select: { recipe: { select: { userId: true } } },
		});
		if (!step) throw new TRPCError({ code: "NOT_FOUND" });
		if (step.recipe.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });

		return prisma.step.delete({ where: input });
	}),
});
