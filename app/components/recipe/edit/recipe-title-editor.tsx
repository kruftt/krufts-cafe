import { Input } from "@components/ui/input";
import { useState } from "react";

export function RecipeTitleEditor(
  { value, onSave }:
  { value: string, onSave: (v: string) => void })
{
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  function onSubmit() {
    onSave(text);
    setEditing(false);
  }

  return (
			<>
				{editing ? (
					<Input
						type="text"
            className="text-center my-4 text-2xl! border-none ring-0!"
						value={text}
						onChange={(e) => setText(e.target.value)}
						onBlur={onSubmit}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
					/>
				) : (
					<button type="button" onClick={() => setEditing(true)}>
						<h1 className="text-center my-4 text-2xl">{text}</h1>
					</button>
				)}
			</>
		);
}
