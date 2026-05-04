export const sectionTitleStyles = "text-center text-xl! font-normal!";

export function SectionTitle({ children }: React.PropsWithChildren) {
  return (
    <h2 className={sectionTitleStyles}>
      {children}
    </h2>
  )
}