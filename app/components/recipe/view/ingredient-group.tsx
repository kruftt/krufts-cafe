import type { IngredientGroupData } from "@services/recipe";

interface Props extends React.ComponentProps<"div"> {
	group: IngredientGroupData;
	scale: number;
}

export function IngredientGroup({ group, scale }: Props) {
	return (
		<div className="ingredient_group">
			<h3 className="ingredient_group__name">{group.name}</h3>
			{group.ingredients.map((ingredient) => (
				<div key={ingredient.id} className="ingredient">
					<span className="ingredient__amount">{Math.round(1000 * scale * ingredient.amount) / 1000}</span>
					<span>{ingredient.units}</span>
					<span>{ingredient.name}</span>
				</div>
			))}
		</div>
	);
}