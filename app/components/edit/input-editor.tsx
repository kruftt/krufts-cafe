import { useEditor } from "@hooks";
import { cn } from "@lib/utils";

interface Props extends React.ComponentProps<"input"> {
	onSave: (value: string) => void;
	validate?: (value: string) => string | undefined;
	clear?: boolean;
	resize?: boolean;
}

export function InputEditor({
	className,
	clear,
	onSave,
	validate,
	value,
	resize,
	...rest
}: Props) {
	const {draft, error, onKeyDown, onChange, submit} = useEditor(value || "", onSave, validate, false, clear);

	return (
		<div
			className={cn(
				"relative flex items-center",
				resize ? "" : "grow",
				className,
			)}
		>
			<input
				className={cn(
					"bg-transparent border-none outline-none p-0 m-0 font-inherit! text-inherit! aria-invalid:ring-3 aria-invalid:border-destructive aria-invalid:ring-destructive:20 dark:aria-invalid:ring-destructive/50 max-w-none",
					resize ? "field-sizing-content" : "w-1/1",
				)}
				aria-invalid={!!error}
				value={draft}
				onChange={onChange}
				onBlur={submit}
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
