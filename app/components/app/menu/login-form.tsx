import { FormField, PasswordInput, SubmitButton } from "@components/controls";
import { Field, FieldGroup } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@hooks";
import { User } from "@schema";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
	const emailRef = useRef<HTMLInputElement>(null);
	const { mutate, isPending, error } = useLogin(onSuccess);

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	const form = useForm<User.Login>({
		resolver: zodResolver(User.Login),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(data: User.Login) {
		mutate(data);
	}

	return (
		<form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<FieldGroup>
					<FormField name="email" control={form.control} label="Email" id="form-login-email">
						{(field, invalid) => (
							<Input {...field} id="form-login-email" ref={emailRef} type="email" aria-invalid={invalid} placeholder="email@domain.com" autoComplete="email" disabled={isPending} />
						)}
					</FormField>
					<FormField name="password" control={form.control} label="Password" id="form-login-password">
						{(field, invalid) => (
							<PasswordInput {...field} id="form-login-password" aria-invalid={invalid} placeholder="xxxxxxxx" autoComplete="current-password" disabled={isPending} />
						)}
					</FormField>
				</FieldGroup>
				<Field>
					<SubmitButton form="form-login" inProgress={isPending} error={error?.message ?? ""}>
						Login
					</SubmitButton>
				</Field>
			</FieldGroup>
		</form>
	);
}
