import { cn } from "@lib/utils";
import type { Section } from "@schema";
import { IngredientView } from "./ingredient-view";

interface Props {
	sections: Section.Full[];
}

export function IngredientSummary({ sections }: Props) {
	return (
		<div>
			<h3 className="mt-8 mb-4 text-2xl text-center font-bold">Ingredients</h3>
			<div className="flex flex-wrap justify-center gap-4">
				{sections.map((section) => (
					<div
						key={section.id}
						className={cn(
							"grow min-w-40 max-w-90 subsection",
						)}
					>
						<h3 className="subsection__title">{section.name}</h3>
						<div>
							{section.ingredients.map((ingredient) => (
								<IngredientView key={ingredient.id} ingredient={ingredient} />
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
