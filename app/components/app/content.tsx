import { cn } from "@lib/utils";

export function ContentContainer({ children }: React.ComponentProps<'div'>) {
  return (
    <div className="m-auto max-w-296 px-4">
      { children }
    </div>
  )
}

export function ContentHeader({ children }: React.ComponentProps<'div'>) {
	return <div className="mt-6 mb-8 text-center">{children}</div>;
}

export function ContentPane({ children, className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn("w-1/1 border rounded-2xl mt-6 p-6", className)}>
      { children }
    </div>
  )
}
