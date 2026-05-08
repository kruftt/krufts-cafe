import { type ProcedureOptions, useEditor } from "@hooks";
import { cn } from "@lib/utils";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	onSave: (v: string, options: ProcedureOptions) => void;
	resize?: boolean;
	validate?: (value: string) => string | undefined;
}

export function TextareaEditor({
	className,
	onSave,
	resize,
	validate,
	value: initialValue,
	...rest
}: Props) {
	const { value, busy, error, onKeyDown, onChange, onBlur } = useEditor(
		initialValue || "",
		onSave,
		validate,
		{ ctrl: true },
	);

	return (
		<div
			className={cn(
				"relative flex items-center",
				resize ? "" : "grow",
				// className,
			)}
		>
			<textarea
				className={cn(
					"block bg-transparent border-none outline-none p-0 m-0 font-inherit text-inherit field-sizing-content",
					resize ? "field-sizing-content" : "w-1/1",
					className,
				)}
				value={value}
				disabled={busy}
				onBlur={onBlur}
				onChange={onChange}
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
