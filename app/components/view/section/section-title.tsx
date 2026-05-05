export const sectionTitleStyles = "text-center text-2xl! p-1 font-bold!";

export function SectionTitle({ children }: React.PropsWithChildren) {
  return (
    <h2 className={sectionTitleStyles}>
      {children}
    </h2>
  )
}