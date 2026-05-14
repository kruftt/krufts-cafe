import type { Ingredient } from "@schema";

interface Props {
	ingredient: Ingredient.Model;
	scale: number;
}

export function IngredientView({ ingredient, scale }: Props) {
	return (
		<div className="ingredient">
			<span>{Math.round(1000 * scale * ingredient.amount) / 1000}</span>
			<span>{ingredient.units}</span>
			<span>{`${ingredient.name}${ingredient.description ? ',' : ''}`}</span>
			<span>{ingredient.description}</span>
		</div>
	);
}
