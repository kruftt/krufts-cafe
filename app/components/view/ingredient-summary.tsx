import { cn } from "@lib/utils";
import type { Section } from "@schema";
import { IngredientView } from "./ingredient-view";

interface Props {
	sections: Section.Full[];
	scale: number;
}

export function IngredientSummary({ sections, scale }: Props) {
	return (
		<div className="columns-sm gap-4 mt-4">
			{sections.map((section) => (
				<div
					key={section.id}
					className={cn("subsection mb-4 break-inside-avoid")}
				>
					<h3 className="subsection__title">{section.name}</h3>
					<div>
						{section.ingredients.map((ingredient) => (
							<IngredientView
								key={ingredient.id}
								ingredient={ingredient}
								scale={scale}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
