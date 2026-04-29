import { prisma } from "@lib/prisma";
import { Model, Step } from "@schema";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

export const stepRouter = router({
	create: authedProcedure
		.input(Step.Create)
		.mutation(async ({ input, ctx }) => {
			return prisma.step.create({
				data: { ...input, userId: ctx.session.user.id },
			});
		}),

	update: authedProcedure.input(Step.Model).mutation(async ({ input, ctx }) => {
		const step = await prisma.step.findUnique({ where: { id: input.id } });
		if (!step) throw new TRPCError({ code: "NOT_FOUND" });
		if (step.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.step.update({ where: { id: input.id }, data: input });
	}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const step = await prisma.step.findUnique({ where: { id: input.id } });
		if (!step) throw new TRPCError({ code: "NOT_FOUND" });
		if (step.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.step.delete({ where: { id: input.id } });
	}),

	reorder: authedProcedure.input(Model.Indices).mutation(async ({ input, ctx }) => {
		if (input.length === 0) return;
		const ids = input.map((item) => item.id);
		const count = await prisma.step.count({
			where: { id: { in: ids }, userId: ctx.session.user.id },
		});
		if (count !== input.length) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.$transaction(
			input.map((item) => prisma.step.update({ where: { id: item.id }, data: { index: item.index } }))
		);
	}),
});
