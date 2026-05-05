import { DynamicInputEditor, InputEditor } from "@components/edit";
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
		<div className="group flex items-center gap-2 py-1">
			<Button
				variant="ghost"
				className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 h-auto"
				onClick={onDelete}
			>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<DynamicInputEditor
				type="number"
				Component={AmountView}
				styles={amountStyles}
				className="p-0 shrink"
				onSave={(v) => save("amount", v)}
			>
				{String(ingredient.amount)}
			</DynamicInputEditor>
			<InputEditor
				Component={UnitsView}
				styles={unitsStyles}
				className="p-0"
				onSave={(v) => save("units", v)}
				placeholder="units"
			>
				{ingredient.units}
			</InputEditor>
			<InputEditor
				Component={NameView}
				styles={nameStyles}
				className="p-0 text-nowrap"
				onSave={(v) => save("name", v)}
			>
				{ingredient.name}
			</InputEditor>
			<InputEditor
				Component={DescriptionView}
				styles={descriptionStyles}
				className="p-0 grow text-left"
				placeholder="preparation"
				onSave={(v) => save("description", v)}
			>
				{ingredient.description}
			</InputEditor>
		</div>
	);
}
