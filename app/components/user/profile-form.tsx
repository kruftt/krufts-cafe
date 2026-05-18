import { SubmitButton } from "@components/controls";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "@hooks";
import { auth, type SessionUser } from "@lib/auth-client";
import { User } from "@schema";
import { Controller, useForm } from "react-hook-form";

export function ProfileForm({ user }: { user: SessionUser }) {
		const request = useRequest();

		const form = useForm<User.Names>({
			resolver: zodResolver(User.Names),
			defaultValues: {
				name: user.name,
				// biome-ignore lint: guaranteed by db hook
				handle: user.handle!,
			},
		});

		async function submit(data: User.Names) {
			await auth.updateUser(data, {
				onRequest: request.onRequest,
				onResponse: request.onResponse,
				onError: (ctx) => request.onError(ctx.error.message),
			});
		}

		return (
			<form id="form-profile-names" onSubmit={form.handleSubmit(submit)}>
				<FieldGroup>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="form-profile-names-name">
									Display Name
								</FieldLabel>
								<FieldDescription>
									How your name is displayed to other users.
								</FieldDescription>
								<Input
									{...field}
									id="form-profile-names-name"
									type="text"
									aria-invalid={fieldState.invalid}
									placeholder="Display Name"
									autoComplete="off"
									disabled={request.inProgress}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="handle"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="form-profile-names-handle">
									Handle
								</FieldLabel>
								<FieldDescription>
									Your handle is used in your recipe URLs.
								</FieldDescription>
								<Input
									{...field}
									id="form-profile-names-handle"
									type="text"
									aria-invalid={fieldState.invalid}
									placeholder="User Handle"
									autoComplete="off"
									disabled={request.inProgress}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
				<SubmitButton
					className="mt-6"
					form="form-profile-names"
					request={request}
				>
					Save Changes
				</SubmitButton>
			</form>
		);
	}