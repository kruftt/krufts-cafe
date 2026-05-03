
export const recipeDescStyles = "text-center whitespace-pre-wrap p-4";

export function RecipeDescription({ children }: React.PropsWithChildren) {
	return <div className={recipeDescStyles}>{children}</div>;
}
