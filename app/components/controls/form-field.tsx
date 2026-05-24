import { Field, FieldDescription, FieldError, FieldLabel } from "@components/ui/field";
import type { Control, ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface Props<T extends FieldValues> {
	name: Path<T>;
	control: Control<T>;
	label: string;
	id: string;
	description?: string;
	children: (field: ControllerRenderProps<T, Path<T>>, invalid: boolean) => React.ReactNode;
}

export function FormField<T extends FieldValues>({ name, control, label, id, description, children }: Props<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={id}>{label}</FieldLabel>
					{description && <FieldDescription>{description}</FieldDescription>}
					{children(field, fieldState.invalid)}
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
