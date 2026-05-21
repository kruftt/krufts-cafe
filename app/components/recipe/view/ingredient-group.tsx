import type { IngredientGroupData } from "@services/recipe";

interface Props extends React.ComponentProps<"div"> {
	group: IngredientGroupData;
	scale: number;
}

export function IngredientGroup({ group, scale }: Props) {
	return (
		<div className="ingredient_group">
			{group.name !== '' &&
				<h3 className="ingredient_group__name">{group.name}</h3>
			}
			{group.ingredients.map((ingredient) => (
				<div key={ingredient.id} className="ingredient">
					<span className="ingredient__amount">
						{Math.round(1000 * scale * ingredient.amount) / 1000}
					</span>
					<div className="flex flex-wrap gap-x-1">
						<span>
							{ingredient.units} {ingredient.name}
						</span>
						<span className="ingredient__preparation">
							{ingredient.preparation}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}