import { InputEditor, TextareaEditor } from "@components/edit";
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
		  updateMutation.mutate({ id: ingredient.id, amount: parseFloat(value) });
    else
	  	updateMutation.mutate({ id: ingredient.id, [field]: value });
	}

	return (
		<div className="flex items-center">
			<Button variant="ghost" className="p-1 m-1 h-8 w-8" onClick={onDelete}>
				<XIcon className="h-4 w-4" color="red" />
			</Button>
			<div className="ingredient">
				<InputEditor
					type="number"
					value={String(ingredient.amount)}
					onSave={(v) => save("amount", v)}
					resize
				/>
				<InputEditor
					value={ingredient.units}
					onSave={(v) => save("units", v)}
					placeholder="units"
					resize
				/>
				<InputEditor
					value={ingredient.name}
					onSave={(v) => save("name", v)}
					resize
				/>
				<TextareaEditor
					value={ingredient.description}
					className="ingredient__description"
					placeholder="preparation"
					onSave={(v) => save("description", v)}
					resize
				/>
			</div>
		</div>
	);
}
