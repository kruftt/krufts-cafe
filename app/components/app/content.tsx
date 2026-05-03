import type { PropsWithChildren } from "react";

export function ContentContainer({ children }: PropsWithChildren) {
  return (
    <div className="m-auto max-w-200">
      { children }
    </div>
  )
}

export function ContentHeader({ children }: PropsWithChildren) {
	return <div className="my-6 text-center">{children}</div>;
}

export function ContentPane({ children }: PropsWithChildren) {
  return (
    <div className="w-1/1 border rounded-2xl">
      { children }
    </div>
  )
}
