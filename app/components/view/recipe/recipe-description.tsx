
export const recipeDescStyles = "text-center whitespace-pre-wrap p-4 font-light";

export function RecipeDescription({ children }: React.PropsWithChildren) {
	return <div className={recipeDescStyles}>{children}</div>;
}
