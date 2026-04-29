import { requireAuth } from "@lib/auth-loader"
import type { Route } from "./+types/my-recipes"

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  // const session = requireAuth(request);
  // (await session).user.name
}

export default function MyRecipes() {
  return (
    <div className="w-1/1 flex justify-center">
      <div>
        <h2>My Recipes</h2>
        {/* Populate with recipe list */}
      </div>
    </div>
  )
}