import type { Ingredient } from "@schema";

export function IngredientView({ ingredient }: { ingredient: Ingredient.Model }) {
	return (
		<div className="ingredient">
			<span>{ingredient.amount}</span>
			<span>{ingredient.units}</span>
			<span>{ingredient.name}</span>
			<span>{ingredient.description}</span>
		</div>
	);
}
