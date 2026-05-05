import type { PropsWithChildren } from "react";

export function ContentContainer({ children }: PropsWithChildren) {
  return (
    <div className="m-auto max-w-296 px-4">
      { children }
    </div>
  )
}

export function ContentHeader({ children }: PropsWithChildren) {
	return <div className="my-6 text-center">{children}</div>;
}

export function ContentPane({ children }: PropsWithChildren) {
  return (
    <div className="w-1/1 border rounded-2xl mt-6 p-4">
      { children }
    </div>
  )
}
