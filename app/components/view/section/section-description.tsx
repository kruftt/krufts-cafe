export const sectionDescriptionStyles = "text-left text-md font-light";

export function SectionDescription({ children }: React.PropsWithChildren) {
  return (
    <div className={sectionDescriptionStyles}>
      {children}
    </div>
  )
}