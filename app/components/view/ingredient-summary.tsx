import type { Section } from "@schema";
import { IngredientView } from "./ingredient-view";

interface Props {
	sections: Section.Full[];
}

export function IngredientSummary({ sections }: Props) {
	return (
		<div>
			<div>Ingredient Summary</div>
			{sections.map((section) => (
				<div key={section.id}>
					<h3 className="subsection__title">{section.name}</h3>
					<div>
						{section.ingredients.map((ingredient) => (
							<IngredientView key={ingredient.id} ingredient={ingredient} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
