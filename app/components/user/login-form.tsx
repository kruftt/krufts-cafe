import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "@hooks";
import { auth } from "@lib/auth-client";
import { Button } from "@ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Spinner } from "@ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { PasswordInput } from "./password-input";

const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
	const emailRef = useRef<HTMLInputElement>(null);
	const request = useRequest();

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: LoginSchema) {
		await auth.signIn.email(data, {
			onRequest: request.onRequest,
			onResponse: request.onResponse,
			onError: (ctx) => request.onError(ctx.error.message),
			onSuccess,
		});
	}

	return (
		<form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<FieldGroup>
					<Controller
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="form-login-email">Email</FieldLabel>
								<Input
									{...field}
									id="form-login-email"
									ref={emailRef}
									type="email"
									aria-invalid={fieldState.invalid}
									placeholder="email@domain.com"
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
						name="password"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="form-login-password">Password</FieldLabel>
								<PasswordInput
									{...field}
									id="form-login-password"
									aria-invalid={fieldState.invalid}
									placeholder="xxxxxxxx"
									autoComplete="off"
									disabled={request.inProgress}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
								{/* TODO: password recovery workflow */}
								{/* <a href="/">forgot password?</a> */}
							</Field>
						)}
					/>
				</FieldGroup>

				<Field>
					<Button type="submit" form="form-login" disabled={request.inProgress}>
						{request.inProgress ? (
							<div className="flex items-center gap-2">
								<Spinner />
								Signing in...
							</div>
						) : (
							"Submit"
						)}
					</Button>
					{request.error && (
						<div
							role="alert"
							className="text-sm text-center font-normal text-destructive"
						>
							{request.error}
						</div>
					)}
				</Field>
			</FieldGroup>
		</form>
	);
}
