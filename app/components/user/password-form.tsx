import { SubmitButton } from "@components/app";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "@hooks";
import auth from "@lib/auth-client";
import { User } from "@schema";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { PasswordInput } from "./password-input";


const Schema = z.object({
  currentPassword: User.Password,
  newPassword: User.Password,
})

type Schema = z.infer<typeof Schema>;


export function PasswordForm() {
	const request = useRequest();

	const form = useForm<Schema>({
		resolver: zodResolver(Schema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
	});

	async function submit(data: Schema) {
		await auth.changePassword({ ...data, revokeOtherSessions: true }, {
			onRequest: request.onRequest,
			onResponse: request.onResponse,
			onError: (ctx) => request.onError(ctx.error.message),
		});
	}

	return (
		<form id="form-change-password" onSubmit={form.handleSubmit(submit)}>
			<FieldGroup>
				<h3 className="text-center text-xl">Change Password</h3>
				<Controller
					name="currentPassword"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="form-change-password-current">
								Current Password:
							</FieldLabel>
							<PasswordInput
								{...field}
								id="form-change-password-current"
								aria-invalid={fieldState.invalid}
								placeholder="Current Password"
								autoComplete="off"
								disabled={request.inProgress}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					name="newPassword"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="form-change-password-new">
								New Password:
							</FieldLabel>
							<PasswordInput
								{...field}
								id="form-change-password-new"
								aria-invalid={fieldState.invalid}
								placeholder="New Password"
								autoComplete="off"
								disabled={request.inProgress}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				
			</FieldGroup>
			<SubmitButton
				className="mt-6"
				form="form-change-password"
				request={request}
			>
				Update Password
			</SubmitButton>
		</form>
	);
}