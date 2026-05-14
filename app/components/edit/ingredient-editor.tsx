import { InputEditor, TextareaEditor } from "@components/edit";
import type { ProcedureOptions } from "@hooks";
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

	function updateIngredient(field: keyof Ingredient.Model) {
		return (value: string | number, options: ProcedureOptions) => {
			if (field === "amount") {
				const v = parseFloat(value as string);
				value = Number.isNaN(v) ? 0 : v;
			}
			updateMutation.mutate(
				{ id: ingredient.id, [field]: value },
				{
					onError: (ctx) => options.onError(ctx.message),
					onSuccess: options.onSuccess,
				},
			);
		}
	}

	return (
		<div className="flex items-start justify-start">
			<Button variant="ghost" className="p-1 m-1 h-8 w-8" onClick={onDelete}>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<div className="ingredient mt-1.5">
				<InputEditor
					type="number"
					value={String(ingredient.amount)}
					onSave={updateIngredient("amount")}
					resize
				/>
				<InputEditor
					value={ingredient.units}
					onSave={updateIngredient("units")}
					placeholder="units"
					resize
				/>
				<InputEditor
					value={ingredient.name}
					onSave={updateIngredient("name")}
					placeholder="ingredient"
					resize
				/>
				<TextareaEditor
					value={ingredient.description}
					className="ingredient__description"
					placeholder="(preparation)"
					onSave={updateIngredient("description")}
					// resize
				/>
			</div>
		</div>
	);
}
