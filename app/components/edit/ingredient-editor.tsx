import { InputEditor, TextareaEditor } from "@components/edit";
import { AmountView, amountStyles, DescriptionView, descriptionStyles, NameView, nameStyles, UnitsView, unitsStyles } from "@components/view/ingredient-view";
import { useTRPC } from "@lib/trpc";
import type { Ingredient } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { XIcon } from "lucide-react";


export function IngredientEditor({
	ingredient,
	onDelete,
}: {
	ingredient: Ingredient.Model;
	onDelete: () => void;
}) {
	const trpc = useTRPC();
	const updateMutation = useMutation(trpc.ingredient.update.mutationOptions());

	function save(field: keyof Ingredient.Model, value: string) {
    if (field === "amount")
		  updateMutation.mutate({ ...ingredient, amount: parseFloat(value) });
    else
	  	updateMutation.mutate({ ...ingredient, [field]: value });
	}

	return (
		<div className="flex items-center">
			<Button
				variant="ghost"
				className="p-1 m-1 h-8 w-8"
				onClick={onDelete}
			>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<div className="flex flex-wrap justify-start items-start py-1 gap-x-1 gap-y-0 max-w-150">
				<InputEditor
					type="number"
					value={String(ingredient.amount)}
					className={amountStyles} // "p-0 shrink"
					onSave={(v) => save("amount", v)}
					resize
				/>
				<InputEditor
					value={ingredient.units}
					className={unitsStyles}
					onSave={(v) => save("units", v)}
					placeholder="units"
					resize
				/>
				<InputEditor
					value={ingredient.name}
					className={nameStyles}
					onSave={(v) => save("name", v)}
					resize
				/>
				<TextareaEditor
					value={ingredient.description}
					className={descriptionStyles}
					placeholder="preparation"
					onSave={(v) => save("description", v)}
					resize
				/>
			</div>
		</div>
	);
}
