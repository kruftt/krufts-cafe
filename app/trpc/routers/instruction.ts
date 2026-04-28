import { prisma } from "@lib/prisma";
import { Id, Instruction } from "@schema";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

export const instructionRouter = router({
	create: authedProcedure.input(Instruction.Create).mutation(async ({ input, ctx }) => {
		return prisma.instruction.create({ data: { ...input, userId: ctx.session.user.id } });
	}),

	update: authedProcedure.input(Instruction.Model).mutation(async ({ input, ctx }) => {
		const instruction = await prisma.instruction.findUnique({ where: { id: input.id } });
		if (!instruction) throw new TRPCError({ code: "NOT_FOUND" });
		if (instruction.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.instruction.update({ where: { id: input.id }, data: input });
	}),

	delete: authedProcedure.input(Id).mutation(async ({ input, ctx }) => {
		const instruction = await prisma.instruction.findUnique({ where: { id: input.id } });
		if (!instruction) throw new TRPCError({ code: "NOT_FOUND" });
		if (instruction.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.instruction.delete({ where: { id: input.id } });
	}),
});
