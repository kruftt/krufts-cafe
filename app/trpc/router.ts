import { ingredientRouter } from "./routers/ingredient";
import { instructionRouter } from "./routers/instruction";
import { recipeRouter } from "./routers/recipe";
import { sectionRouter } from "./routers/section";
import { router } from "./server";

export const TRPCRouter = router({
	recipe: recipeRouter,
	instruction: instructionRouter,
	section: sectionRouter,
	ingredient: ingredientRouter,
});

export type TRPCRouter = typeof TRPCRouter;
