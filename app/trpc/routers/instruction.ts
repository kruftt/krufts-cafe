import { prisma } from "@lib/prisma";
import { Instruction, Model } from "@schema";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { authedProcedure, router } from "../server";

const ownerSelect = {
	step: {
		select: {
			recipe: {
				select: { userId: true },
			},
		},
	},
};

export const instructionRouter = router({
	create: authedProcedure
		.input(Instruction.Create)
		.mutation(async ({ input, ctx }) => {
			const step = await prisma.step.findUniqueOrThrow({
				where: { id: input.stepId },
				select: { recipe: { select: { userId: true } } },
			});
			if (step.recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });
			return prisma.instruction.create({ data: input, select: { id: true } });
		}),

	update: authedProcedure
		.input(Instruction.Update.extend({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const instruction = await prisma.instruction.findUniqueOrThrow({
				where: { id: input.id },
				select: ownerSelect,
			});
			if (instruction.step.recipe.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });

			return prisma.instruction.update({ where: { id: input.id }, data: input });
		}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const instruction = await prisma.instruction.findUniqueOrThrow({
			where: input,
			select: ownerSelect,
		});
		if (instruction.step.recipe.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });
		
		return prisma.instruction.delete({ where: { id: input.id } });
	}),
});
