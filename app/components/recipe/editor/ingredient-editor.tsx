import { InputEditor } from "@components/controls";
import { Button } from "@components/ui/button";
import { RecipeIdContext, useRecipeCache } from "@hooks";
import type { IngredientData } from "@services/recipe";
import { XIcon } from "lucide-react";
import { useContext } from "react";

export function IngredientEditor({
	ingredient,
}: {
	ingredient: IngredientData;
}) {
	const { updateIngredientField, removeIngredient } = useRecipeCache(
		useContext(RecipeIdContext),
	);

	return (
		<div className="flex items-center justify-start">
			<Button
				variant="ghost"
				className="h-8 w-8 mr-1"
				onClick={() => removeIngredient.mutate({ id: ingredient.id })}
			>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<div className="ingredient">
				<InputEditor
					type="number"
					className="ingredient__amount"
					value={String(ingredient.amount)}
					onSave={updateIngredientField(ingredient.id, "amount")}
					resize
				/>
				<InputEditor
					value={ingredient.units}
					onSave={updateIngredientField(ingredient.id, "units")}
					placeholder="units"
					resize
				/>
				<InputEditor
					value={ingredient.name}
					onSave={updateIngredientField(ingredient.id, "name")}
					placeholder="ingredient"
					resize
				/>
			</div>
		</div>
	);
}
