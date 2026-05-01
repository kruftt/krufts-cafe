import type { PropsWithChildren } from "react";

function ContentHeader({ children }: PropsWithChildren) {
	return <div className="my-6 text-center text-2xl">{children}</div>;
}

function ContentPane({ children }: PropsWithChildren) {
  return (
    <div>
      { children }
    </div>
  )
}

export {
  ContentHeader
}