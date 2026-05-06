import type { Ingredient } from "@schema";

export const amountStyles = "font-semibold text-sm";
export const unitsStyles = "text-sm";
export const nameStyles = "text-sm font-medium";
export const descriptionStyles = "text-sm ml-1";

export function AmountView({ children }: React.PropsWithChildren) {
	return <span className={amountStyles}>{children}</span>;
}

export function UnitsView({ children }: React.PropsWithChildren) {
	return <span className={unitsStyles}>{children}</span>;
}

export function NameView({ children }: React.PropsWithChildren) {
	return <span className={nameStyles}>{children}</span>;
}

export function DescriptionView({ children }: React.PropsWithChildren) {
	return <span className={descriptionStyles}>{children}</span>;
}


export function IngredientView({ ingredient }: { ingredient: Ingredient.Model }) {
	return (
		<div className="flex gap-2 py-1">
			<AmountView>{ingredient.amount}</AmountView>
			<UnitsView>{ingredient.units}</UnitsView>
			<NameView>{ingredient.name}</NameView>
			{ingredient.description && <DescriptionView>{ingredient.description}</DescriptionView>}
		</div>
	);
}
