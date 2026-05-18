import { DeletionDialog, InputEditor } from "@components/controls";
import { Button } from "@components/ui/button";
import { RecipeIdContext } from "@hooks";
import { useRecipeCache } from "@hooks/recipe-cache";
import { getNextIndex } from "@lib/utils";
import type { IngredientGroupData } from "@services/recipe";
import { PlusIcon, XIcon } from "lucide-react";
import { useContext, useRef } from "react";
import { IngredientEditor } from "./ingredient-editor";

interface Props {
	group: IngredientGroupData;
}

export function IngredientGroupEditor({ group }: Props) {
	const groupRef = useRef<HTMLDivElement>(null);
	const { updateIngredientGroupField, removeIngredientGroup, addIngredient } =
		useRecipeCache(useContext(RecipeIdContext));

	const onSaveName = updateIngredientGroupField(group.id, "name");

	function deleteGroup() {
		removeIngredientGroup.mutate({ id: group.id });
	}

	function createIngredient() {
		addIngredient.mutate({
			groupId: group.id,
			index: getNextIndex(group.ingredients),
		}, {
			onSuccess() {
				setTimeout(() => {
					const el = groupRef.current;
					if (!el) return;
					const amounts = el.querySelectorAll<HTMLInputElement>(":scope .ingredient__amount > input");
					const last = amounts.item(amounts.length - 1);
					if (last) {
						last.select();
					}
				}, 0);
			}
		});
	}

	return (
		<div ref={groupRef} className="ingredient_group">
			<div className="flex">
				<InputEditor
					placeholder="Group Name"
					className="ingredient_group__name"
					value={group.name}
					onSave={onSaveName}
				/>
				<DeletionDialog
					title="Delete Ingredient Section"
					message="Are you sure you wish to delete this ingredient group?"
					item={group.name}
					onConfirm={deleteGroup}
				>
					<Button variant="ghost">
						<XIcon color="red" className="size-6" />
					</Button>
				</DeletionDialog>
			</div>

			{group.ingredients.map((ingredient) => (
				<IngredientEditor key={ingredient.id} ingredient={ingredient} />
			))}

			<Button
				className="w-1/1 -ml-1 justify-start"
				variant="ghost"
				onClick={createIngredient}
			>
				<PlusIcon />
				<span className="text-muted-foreground ml-2 text-sm font-light">
					Add Ingredient
				</span>
			</Button>
		</div>
	);
}
