import { FormField, PasswordInput, SubmitButton } from "@components/controls";
import { FieldGroup } from "@components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "@hooks";
import { User } from "@schema";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const Schema = z.object({
	currentPassword: User.Password,
	newPassword: User.Password,
});

type Schema = z.infer<typeof Schema>;

export function PasswordForm() {
	const mutation = useChangePassword();
	const { mutate, isPending, isSuccess, error } = mutation;

	const form = useForm<Schema>({
		resolver: zodResolver(Schema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
	});

	useEffect(() => {
		const { unsubscribe } = form.watch(() => mutation.reset());
		return unsubscribe;
	}, [form.watch, mutation.reset]);

	function submit(data: Schema) {
		mutate(data);
	}

	return (
		<form id="form-change-password" onSubmit={form.handleSubmit(submit)}>
			<FieldGroup>
				<h3 className="text-center text-xl">Change Password</h3>
				<FormField name="currentPassword" control={form.control} label="Current Password:" id="form-change-password-current">
					{(field, invalid) => (
						<PasswordInput {...field} id="form-change-password-current" aria-invalid={invalid} placeholder="Current Password" autoComplete="off" disabled={isPending} />
					)}
				</FormField>
				<FormField name="newPassword" control={form.control} label="New Password:" id="form-change-password-new">
					{(field, invalid) => (
						<PasswordInput {...field} id="form-change-password-new" aria-invalid={invalid} placeholder="New Password" autoComplete="off" disabled={isPending} />
					)}
				</FormField>
			</FieldGroup>
			<SubmitButton
				className="mt-6"
				form="form-change-password"
				inProgress={isPending}
				success={isSuccess}
				error={error?.message ?? ""}
			>
				Update Password
			</SubmitButton>
		</form>
	);
}
