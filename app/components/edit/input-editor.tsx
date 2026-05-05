import { useEditor } from "@hooks/editor";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	onSave: (value: string) => void;
	children: string;
	Component: React.ComponentType<React.PropsWithChildren>;
	styles: string
}

export function InputEditor({
	children,
	className,
	styles,
	Component,
	onSave,
	...rest
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { editor, setEditor, draft, setDraft, submit } = useEditor(
		inputRef,
		children,
		onSave,
	);

	return (
		<div className={className}>
			{ editor
				? <input
						ref={inputRef}
						className={`w-1/1 outline-0 ${styles}`}
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onBlur={submit}
						onKeyDown={(e) => e.key === "Enter" && submit()}
						{...rest}
					/>
				
				: <button
						type="button"
						className={`w-1/1 hover:bg-white/5 ${draft ? "" : "text-gray-400"} `}
						onClick={() => setEditor(true)}
						onFocus={() => setEditor(true)}
					>
						<Component>{draft || rest.placeholder}</Component>
					</button>
			}
		</div>
	);

	// return editor ? (
	// 	<div className={className}>
	// 		<input
	// 			ref={inputRef}
	// 			className={`w-1/1 outline-0 ${styles}`}
	// 			value={draft}
	// 			onChange={(e) => setDraft(e.target.value)}
	// 			onBlur={submit}
	// 			onKeyDown={(e) => e.key === "Enter" && submit()}
	// 			{...rest}
	// 		/>
	// 	</div>
	// ) : (
	// 	<button
	// 		type="button"
	// 		className={`w-1/1 hover:bg-white/5 ${draft ? "" : "text-gray-400"} ${className}`}
	// 		onClick={() => setEditor(true)}
	// 	>
	// 		<Component>{draft || rest.placeholder}</Component>
	// 	</button>
	// );
}
