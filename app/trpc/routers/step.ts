import { prisma } from "@lib/prisma";
import { Id, Step } from "@schema";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

export const stepRouter = router({
	create: authedProcedure.input(Step.Create).mutation(async ({ input, ctx }) => {
		return prisma.step.create({ data: { ...input, userId: ctx.session.user.id } });
	}),

	update: authedProcedure.input(Step.Model).mutation(async ({ input, ctx }) => {
		const step = await prisma.step.findUnique({ where: { id: input.id } });
		if (!step) throw new TRPCError({ code: "NOT_FOUND" });
		if (step.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.step.update({ where: { id: input.id }, data: input });
	}),

	delete: authedProcedure.input(Id).mutation(async ({ input, ctx }) => {
		const step = await prisma.step.findUnique({ where: { id: input.id } });
		if (!step) throw new TRPCError({ code: "NOT_FOUND" });
		if (step.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.step.delete({ where: { id: input.id } });
	}),
});
