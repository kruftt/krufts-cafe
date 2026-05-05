export const instructionStyles = "text-sm text-left py-1";

export function InstructionView({ children }: React.PropsWithChildren) {
	return (<p className={instructionStyles}>
		{children}
		</p>);
}