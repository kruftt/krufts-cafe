import { useEditor } from "@hooks/editor";
import { useEffect, useRef, useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onSave: (value: string) => void;
  children: string;
  Component: React.ComponentType<React.PropsWithChildren>;
  styles: string
}

export function DynamicInputEditor({
  children,
  className,
  styles,
  Component,
  onSave,
  ...rest
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);
  const { editor, setEditor, draft, setDraft, submit } = useEditor(
    inputRef,
    children,
    onSave,
  );
  
  // biome-ignore lint: false positive
  useEffect(() => {
    if (mirrorRef.current) setWidth(mirrorRef.current.offsetWidth)
    }, [draft]);
  
  
  return (
			<div className={className}>
				<span
					ref={mirrorRef}
					className={`${styles} invisible absolute whitespace-pre`}
				>
					{draft}
				</span>
				{editor ? (
					<input
						ref={inputRef}
						className={`outline-0 ${styles}`}
						style={{ width: `${width + 4}px` }}
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onBlur={submit}
						onKeyDown={(e) => e.key === "Enter" && submit()}
						{...rest}
					/>
				) : (
					<button
						type="button"
						className={`w-1/1 hover:bg-white/5 ${draft ? "" : "text-gray-400"} `}
						onClick={() => setEditor(true)}
						onFocus={() => setEditor(true)}
					>
						<Component>{draft || rest.placeholder}</Component>
					</button>
				)}
			</div>
		);
}
