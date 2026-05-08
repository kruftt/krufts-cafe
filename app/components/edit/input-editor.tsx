import { type ProcedureOptions, useEditor } from "@hooks";
import { cn } from "@lib/utils";

interface Props extends React.ComponentProps<"input"> {
	onSave: (v: string, options: ProcedureOptions) => void;
	validate?: (value: string) => string | undefined;
	clear?: boolean;
	reset?: boolean;
	resize?: boolean;
}

export function InputEditor({
	className,
	clear,
	onSave,
	validate,
	value: initialValue,
	reset,
	resize,
	...rest
}: Props) {
	const { value, busy, error, onKeyDown, onChange, onBlur } = useEditor(
		initialValue || "",
		onSave,
		validate,
		{ clear, reset }
	);

	return (
		<div
			className={cn(
				"relative flex items-center",
				resize ? "" : "grow",
				// className,
			)}
		>
			<input
				className={cn(
					"bg-transparent border-none outline-none p-0 m-0 font-inherit! text-inherit! aria-invalid:ring-3 aria-invalid:border-destructive aria-invalid:ring-destructive:20 dark:aria-invalid:ring-destructive/50 max-w-none",
					resize ? "field-sizing-content" : "w-1/1",
					className,
				)}
				aria-invalid={!!error}
				value={value}
				disabled={busy}
				aria-disabled={busy}
				onChange={onChange}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
				{...rest}
			/>
			{error && (
				<span className="absolute top-full left-0 right-0 m-auto mt-3 text-sm text-destructive bg-popover border border-destructive rounded-lg px-3 py-2 z-100 ring-2 ring-destructive w-fit">
					{error}
				</span>
			)}
		</div>
	);
}
