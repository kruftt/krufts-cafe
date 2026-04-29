import { ingredientRouter } from "./routers/ingredient";
import { instructionRouter } from "./routers/instruction";
import { recipeRouter } from "./routers/recipe";
import { sectionRouter } from "./routers/section";
import { router } from "./server";

export const trpcRouter = router({
	recipe: recipeRouter,
	instruction: instructionRouter,
	section: sectionRouter,
	ingredient: ingredientRouter,
});

export type TrpcRouter = typeof trpcRouter;
