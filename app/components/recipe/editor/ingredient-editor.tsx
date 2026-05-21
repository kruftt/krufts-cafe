import { InputEditor, TextareaEditor } from "@components/controls";
import { Button } from "@components/ui/button";
import { RecipeIdContext, useRecipeCache } from "@hooks";
import type { CachedIngredientData } from "@hooks/recipe-cache";
import { XIcon } from "lucide-react";
import { useContext } from "react";

export function IngredientEditor({
	ingredient,
}: {
	ingredient: CachedIngredientData;
}) {
	const { updateIngredientField, removeIngredient } = useRecipeCache(
		useContext(RecipeIdContext),
	);

	return (
		<div className="flex items-start justify-start">
			<Button
				variant="ghost"
				className="h-8 w-8 mr-1"
				onClick={() =>
					ingredient.id && removeIngredient.mutate({ id: ingredient.id })
				}
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
				<div className="flex flex-wrap items-start gap-x-1">
					<div className="flex gap-x-1">
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
					<TextareaEditor
						className="ingredient__preparation"
						value={ingredient.preparation}
						onSave={updateIngredientField(ingredient.id, "preparation")}
						placeholder="preparation"
						resize
					/>
				</div>
			</div>
		</div>
	);
}
