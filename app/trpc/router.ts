import { recipeRouter } from "./routers/recipe";
import { router } from "./server";

export const trpcRouter = router({
	recipe: recipeRouter,
});

export type TrpcRouter = typeof trpcRouter;
