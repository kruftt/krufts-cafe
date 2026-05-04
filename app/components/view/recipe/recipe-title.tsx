
export const recipeTitleStyles = "my-4 text-center font-bold text-2xl!";

export function RecipeTitle({ children }: React.PropsWithChildren) {
  return <h1 className={recipeTitleStyles}>{children}</h1>;
}
