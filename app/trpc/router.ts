import { ingredientRouter } from "./routers/ingredient";
import { instructionRouter } from "./routers/instruction";
import { recipeRouter } from "./routers/recipe";
import { stepRouter } from "./routers/step";
import { router } from "./server";

export const trpcRouter = router({
	recipe: recipeRouter,
	instruction: instructionRouter,
	step: stepRouter,
	ingredient: ingredientRouter,
});

export type TrpcRouter = typeof trpcRouter;
