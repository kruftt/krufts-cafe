import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@lib/auth-client";
import { Button } from "@ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Spinner } from "@ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import CreationForm from "./creation-form";

const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const [requesting, setRequesting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [authError, setAuthError] = useState("");

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: LoginSchema) {
		setAuthError("");
		setRequesting(true);
		await auth.signIn.email(data, {
			onError: (ctx) => setAuthError(ctx.error.message),
		});
		setRequesting(false);
	}

	return (
		<Popover>
			<PopoverTrigger render={<Button className="drop-shadow-md/30" />}>
				login
			</PopoverTrigger>
			<PopoverContent>
				<form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
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
										type="email"
										aria-invalid={fieldState.invalid}
										placeholder="email@domain.com"
										autoComplete="off"
										disabled={requesting}
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
									<FieldLabel htmlFor="form-login-password">
										Password
									</FieldLabel>
									<div className="relative">
										<Input
											{...field}
											id="form-login-password"
											type={showPassword ? "text" : "password"}
											aria-invalid={fieldState.invalid}
											placeholder="xxxxxxxx"
											autoComplete="off"
											disabled={requesting}
											className="pr-9"
										/>
										<button
											type="button"
											onClick={() => setShowPassword((v) => !v)}
											aria-label={
												showPassword ? "Hide password" : "Show password"
											}
											className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
										>
											{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
										</button>
									</div>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
									{/* TODO: password recovery workflow */}
									{/* <a href="/">forgot password?</a> */}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
				<Button type="submit" form="form-login" disabled={requesting}>
					{requesting ? (
						<div className="flex items-center gap-2">
							<Spinner />
							Signing in...
						</div>
					) : (
						"Submit"
					)}
				</Button>
				{authError && (
					<div
						role="alert"
						className="text-sm text-center font-normal text-destructive"
					>
						{authError}
					</div>
				)}
				<CreationForm />
			</PopoverContent>
		</Popover>
	);
}
