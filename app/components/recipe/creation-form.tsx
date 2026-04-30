import { Button } from "@ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";

export default function CreationForm() {
	return (
		<div className="relative my-4">
			<Button className="absolute w-18 left-0 rounded-r-none">+</Button>
			<Field orientation="horizontal" className="gap-0">
				{/* <FieldLabel>Create Recipe</FieldLabel> */}
				<Input className="pl-22" placeholder="Create New Recipe" />
			</Field>
		</div>
	);
}
