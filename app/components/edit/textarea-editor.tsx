import { cn } from "@lib/utils";
import { useState } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	onSave: (value: string) => void;
	resize?: boolean;
	validate?: (value: string) => string | undefined;
}

export function TextareaEditor({
		className,
		onSave,
		resize,
		validate,
		value,
		...rest
	}: Props) {
		const [draft, setDraft] = useState(value);
		const [error, setError] = useState<string>();

		function submit() {
			const message = validate?.(draft as string);
			if (message) {
				setError(message);
				return;
			}
			onSave(draft as string);
		}

		function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
			if (e.ctrlKey && e.key === "Enter") {
				e.currentTarget.blur();
				submit();
			}
		}

		return (
			<div
				className={cn(
					"relative flex items-center",
					resize ? "" : "grow",
					className,
				)}
			>
				<textarea
					className={cn(
						"block bg-transparent border-none outline-none p-0 m-0 font-inherit text-inherit field-sizing-content",
						resize ? "field-sizing-content" : "w-1/1",
					)}
					value={draft}
					onBlur={submit}
					onChange={(e) => setDraft(e.target.value)}
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
