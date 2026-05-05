export const sectionDescriptionStyles = "p-2 text-left text-base! font-light whitespace-pre-wrap";

export function SectionDescription({ children }: React.PropsWithChildren) {
  return (
    <div className={sectionDescriptionStyles}>
      {children}
    </div>
  )
}