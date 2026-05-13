import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { Badge } from "@components/ui/badge";
import { IngredientSummary, IngredientView } from "@components/view";
import { useBookmarks } from "@hooks/bookmark";
import { usePins } from "@hooks/pins";
import { auth } from "@lib/auth-client";
import { formatDuration } from "@lib/utils";
import { findRecipe } from "@services/recipe";
import { getUser } from "@services/user";
import { Button } from "@ui/button";
import { BookmarkIcon, ClockIcon, PinIcon } from "lucide-react";
import { redirect } from "react-router";
import type { Route } from "./+types/recipes.$handle.$slug";

export async function loader({ params }: Route.LoaderArgs) {
	const user = await getUser(params.handle);
	if (!user) {
		throw redirect("/");
	}

	const recipe = await findRecipe({
		userId_slug: { userId: user.id, slug: params.slug },
	});
	if (!recipe) {
		throw redirect("/");
	}

	return { recipe };
}

export default function RecipePage({ loaderData }: Route.ComponentProps) {
	const { recipe } = loaderData;
	const { data: session } = auth.useSession();
	const { isPinned, togglePin } = usePins();
	const { isBookmarked, toggleBookmark } = useBookmarks();
	const loggedIn = !!session;
	const pinned = isPinned(recipe.id);
	const bookmarked = isBookmarked(recipe.id);

	return (
		<ContentContainer>
			<ContentHeader>
				<h2 className="recipe__title">{recipe.name}</h2>
				<div className="recipe__author">By {recipe.user.name}</div>
				<p className="recipe__description">{recipe.description}</p>
				<div className="recipe__tags">
					{recipe.tags.map((tag) => (
						<Badge key={tag}>{tag}</Badge>
					))}
				</div>
				<div className="flex gap-1 justify-center items-center">
					<ClockIcon size={18} />
					{formatDuration(recipe.duration)}
				</div>
				<div className="flex justify-center items-center">
					<Button variant="ghost" onClick={() => togglePin(recipe)}>
						<PinIcon fill={pinned ? "currentColor" : "none"} />
					</Button>
					{loggedIn && (
						<Button variant="ghost" onClick={() => toggleBookmark(recipe.id)}>
							<BookmarkIcon fill={bookmarked ? "currentColor" : "none"} />
						</Button>
					)}
				</div>
			</ContentHeader>
			{(recipe.intro || recipe.sections.length) && (
				<ContentPane>
					<div className="recipe__intro">{recipe.intro}</div>
					{recipe.sections.length > 1 && (
						<IngredientSummary sections={recipe.sections} />
					)}
				</ContentPane>
			)}
			{recipe.sections.map((section) => (
				<ContentPane key={section.id}>
					<div className="section__header">
						<h3 className="section__title">{section.name}</h3>
						<p className="section__description">{section.description}</p>
					</div>
					<div className="section__body">
						<div className="ingredients subsection">
							<h4 className="subsection__title">Ingredients</h4>
							<div>
								{section.ingredients.map((ingredient) => (
									<IngredientView key={ingredient.id} ingredient={ingredient} />
								))}
							</div>
						</div>
						<div className="instructions subsection">
							<h4 className="subsection__title">Instructions</h4>
							<div>
								{section.instructions.map((instruction, i) => (
									<div key={instruction.id} className="instruction">
										<span>{i}.</span>
										<span>{instruction.description}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</ContentPane>
			))}
		</ContentContainer>
	);
}
