
export const recipeDescStyles = "text-base! whitespace-pre-wrap text-center font-normal p-2";

export function RecipeDescription({ children }: React.PropsWithChildren) {
	return <div className={recipeDescStyles}>{children}</div>;
}
