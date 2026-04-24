import type { PropsWithChildren } from "react";

export default function AppBarButton({
	children,
	...props
}: PropsWithChildren) {
	return (
		<div
			{...props}
			className="drop-shadow-md/30 rounded-xl bg-cafe-blue-2 dark:bg-cafe-blue-2-dark"
		>
			{children}
		</div>
	);
}
