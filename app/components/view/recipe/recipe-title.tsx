
export const recipeTitleStyles = "text-center my-4 text-2xl!"

export function RecipeTitle({ children }: React.PropsWithChildren) {
  return <h1 className={recipeTitleStyles}>{children}</h1>;
}
