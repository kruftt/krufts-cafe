import { prisma } from "@lib/prisma";
import { Instruction, Model } from "@schema";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

export const instructionRouter = router({
	create: authedProcedure
		.input(Instruction.Create)
		.mutation(async ({ input, ctx }) => {
			return prisma.instruction.create({
				data: { ...input, userId: ctx.session.user.id },
			});
		}),

	update: authedProcedure
		.input(Instruction.Partial)
		.mutation(async ({ input, ctx }) => {
			const instruction = await prisma.instruction.findUnique({
				where: { id: input.id },
			});
			if (!instruction) throw new TRPCError({ code: "NOT_FOUND" });
			if (instruction.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });
			return prisma.instruction.update({
				where: { id: input.id },
				data: input,
			});
		}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const instruction = await prisma.instruction.findUnique({
			where: { id: input.id },
		});
		if (!instruction) throw new TRPCError({ code: "NOT_FOUND" });
		if (instruction.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.instruction.delete({ where: { id: input.id } });
	}),

	reorder: authedProcedure.input(Model.Indices).mutation(async ({ input, ctx }) => {
		if (input.length === 0) return;
		const ids = input.map((item) => item.id);
		const count = await prisma.instruction.count({
			where: { id: { in: ids }, userId: ctx.session.user.id },
		});
		if (count !== input.length) throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.$transaction(
			input.map((item) => prisma.instruction.update({ where: { id: item.id }, data: { index: item.index } }))
		);
	}),
});
