import { bookmarkRouter } from "./routers/bookmark";
import { ingredientRouter } from "./routers/ingredient";
import { instructionRouter } from "./routers/instruction";
import { pinRouter } from "./routers/pin";
import { recipeRouter } from "./routers/recipe";
import { sectionRouter } from "./routers/section";
import { router } from "./server";

export const TRPCRouter = router({
	recipe: recipeRouter,
	instruction: instructionRouter,
	section: sectionRouter,
	ingredient: ingredientRouter,
	pin: pinRouter,
	bookmark: bookmarkRouter,
});

export type TRPCRouter = typeof TRPCRouter;
