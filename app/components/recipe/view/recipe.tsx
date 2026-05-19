import { Container, Header, Panel } from "@components/app";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useBookmarks, usePins } from "@hooks";
import { auth } from "@lib/auth-client";
import type { RecipeData } from "@services/recipe";
import { BookmarkIcon, PinIcon } from "lucide-react";
import { useState } from "react";
import { IngredientGroup } from "./ingredient-group";
import { Step } from "./step";
import { StepBar } from "./step-bar";

interface Props extends React.ComponentProps<"div"> {
  recipe: RecipeData;
}

export function Recipe({ recipe }: Props) {
  const { data: sessionData } = auth.useSession();
  const loggedIn = !!sessionData;

  const { isPinned, togglePin } = usePins();
  const pinned = isPinned(recipe.id);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(recipe.id);

  const [scale, setScale] = useState(1);


  return (
		<>
			<StepBar steps={recipe.steps} />
			<Container>
				<Header.Section>
					<Header.Title>
						<h2 className="recipe__title">{recipe.name}</h2>
						<div className="recipe__author">By {recipe.user.name}</div>
						<Button variant="ghost" onClick={() => togglePin(recipe)}>
							<PinIcon fill={pinned ? "currentColor" : "none"} />
						</Button>
						{loggedIn && (
							<Button
								variant="ghost"
								onClick={() => toggleBookmark(recipe.id)}
							>
								<BookmarkIcon fill={bookmarked ? "currentColor" : "none"} />
							</Button>
						)}
					</Header.Title>

					{recipe.tags.length > 0 && (
						<Header.Item>
							<div className="recipe__tags">
								{recipe.tags.map((tag) => (
									<Badge key={tag} variant="default" className="tag">
										{tag}
									</Badge>
								))}
							</div>
						</Header.Item>
					)}

					<Header.Item className="recipe__duration">
						<div>
							<div className="recipe__duration_title">Prep</div>
							<div className="recipe__duration_entry">
								{`${recipe.prepTime} min`}
							</div>
						</div>
						<div className="border-l" />
						<div>
							<div className="recipe__duration_title">Cook</div>
							<div className="recipe__duration_entry">
								{`${recipe.cookTime} min`}
							</div>
						</div>
						<div className="border-l" />
						<div>
							<div className="recipe__duration_title">Total</div>
							<div className="recipe__duration_entry">
								{`${recipe.prepTime + recipe.cookTime} min`}
							</div>
						</div>
					</Header.Item>

					<Header.Item className="recipe__serves">
						Serves
						<span className="font-bold ml-1">{recipe.serves}</span>
					</Header.Item>
				</Header.Section>

				<Panel.Section>
					{recipe.intro && (
						<div className="recipe__intro">{recipe.intro}</div>
					)}
				</Panel.Section>

				<Panel.Section id="ingredients">
					<Panel.Title className="text-2xl justify-center">
						Ingredients
					</Panel.Title>

					<Panel.Item className="text-center text-sm font-light -mt-4">
						<div className="mr-4">Scale: {scale.toFixed(2)}</div>
						<Input
							className="max-w-40 px-0 accent-gray-700 shadow-none"
							type="range"
							min={0.25}
							max={4.0}
							step={0.25}
							defaultValue={1}
							onChange={(e) => setScale(parseFloat(e.currentTarget.value))}
						/>
					</Panel.Item>

					<Panel.Item className="ingredient_groups">
						{recipe.ingredientGroups.map((group) => (
							<IngredientGroup key={group.id} group={group} scale={scale} />
						))}
					</Panel.Item>
				</Panel.Section>

				{recipe.steps.map((step, i) => (
					<Step key={step.id} step={step} index={i + 1} />
				))}
			</Container>
		</>
	);
}