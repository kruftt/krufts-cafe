import { pinnedRecipesAtom } from "@atoms/user";
import { usePins } from "@hooks/pins";
import { buttonVariants } from "@ui/button";
import { useAtomValue } from "jotai";
import { PinIcon, XIcon } from "lucide-react";

export function PinnedRecipes() {
	const pinnedRecipes = useAtomValue(pinnedRecipesAtom);
	const { togglePin } = usePins();

	return (
		<div
			className={`grid transition-all duration-250 ${pinnedRecipes.length ? "grid-rows-[1fr]" : "grid-rows-[0.4fr]"}`}
		>
			<div className="overflow-hidden relative z-5 shadow-[0_0_3px_3px_rgba(0,0,0,0.35)] dark:shadow-[0_0_3px_3px_rgba(0,0,0,1)] dark:shadow-black">
				<div className="flex flex-wrap items-center bg-cafe-blue-1-dark gap-2 px-4 py-2">
					<PinIcon size={16} className="text-white shrink-0 opacity-60" />
					{pinnedRecipes.map((recipe) => (
						<div
							key={recipe.id}
							className={`${buttonVariants({ variant: "secondary", size: "sm" })} flex items-center gap-1 pl-1`}
						>
							<button
								type="button"
								onClick={() => togglePin(recipe)}
								className="opacity-60 hover:opacity-100"
							>
								<XIcon size={12} />
							</button>
							<a href={`/recipes/${recipe.user.handle}/${recipe.slug}`}>
								{recipe.name}
							</a>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
