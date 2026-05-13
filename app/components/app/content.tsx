import { cn } from "@lib/utils";

export function ContentContainer({ children, className }: React.ComponentProps<'div'>) {
  return <div className={`m-auto max-w-296 px-4 ${className}`}>{children}</div>;
}

export function ContentHeader({ children, className }: React.ComponentProps<'div'>) {
	return <div className={`mt-6 mb-8 text-center ${className}`}>{children}</div>;
}

export function ContentPane({ children, className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn("w-1/1 border border-primary rounded-2xl mt-6 p-6 bg-card text-card-foreground shadow-lg shadow-black/15 dark:shadow-black/30", className)}>
      { children }
    </div>
  )
}
