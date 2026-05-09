import { prisma } from "@lib/prisma";
import { Model } from "@schema";
import { authedProcedure, router } from "../server";

export const bookmarkRouter = router({
	create: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		return prisma.bookmark.create({
			data: { recipeId: input.id, userId: ctx.session.user.id },
		});
	}),

	delete: authedProcedure.input(Model.Id).mutation(async ({ input, ctx }) => {
		return prisma.bookmark.delete({
			where: { userId_recipeId: { userId: ctx.session.user.id, recipeId: input.id } },
		});
	}),
});
