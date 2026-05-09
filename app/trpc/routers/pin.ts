import { prisma } from "@lib/prisma";
import { Model } from "@schema";
import { authedProcedure, router } from "../server";

export const pinRouter = router({
	create: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		return prisma.pin.create({
			data: { recipeId: input.id, userId: ctx.session.user.id },
		});
	}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		return prisma.pin.delete({
			where: { userId_recipeId: { userId: ctx.session.user.id, recipeId: input.id } },
		});
	}),
});
