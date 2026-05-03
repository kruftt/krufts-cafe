import { prisma } from "@lib/prisma";
import { Model, Section } from "@schema";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../server";

export const sectionRouter = router({
	create: authedProcedure
		.input(Section.Create)
		.mutation(async ({ input, ctx }) => {
			const section = await prisma.section.create({
				data: {
					userId: ctx.session.user.id,
					name: "",
					description: "",
					...input
				},
			});

			return {
				...section,
				instructions: [],
				ingredients: [],
			}
		}),

	update: authedProcedure
		.input(Section.Model)
		.mutation(async ({ input, ctx }) => {
			const section = await prisma.section.findUnique({ where: { id: input.id } });
			if (!section) throw new TRPCError({ code: "NOT_FOUND" });
			if (section.userId !== ctx.session.user.id)
				throw new TRPCError({ code: "FORBIDDEN" });
			return prisma.section.update({ where: { id: input.id }, data: input });
		}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		const section = await prisma.section.findUnique({ where: { id: input.id } });
		if (!section) throw new TRPCError({ code: "NOT_FOUND" });
		if (section.userId !== ctx.session.user.id)
			throw new TRPCError({ code: "FORBIDDEN" });
		return prisma.section.delete({ where: { id: input.id } });
	}),

	reorder: authedProcedure
		.input(Model.Indices)
		.mutation(async ({ input, ctx }) => {
			if (input.length === 0) return;
			const ids = input.map((item) => item.id);
			const count = await prisma.section.count({
				where: { id: { in: ids }, userId: ctx.session.user.id },
			});
			if (count !== input.length) throw new TRPCError({ code: "FORBIDDEN" });
			return prisma.$transaction(
				input.map((item) =>
					prisma.section.update({
						where: { id: item.id },
						data: { index: item.index },
					}),
				),
			);
		}),
});
