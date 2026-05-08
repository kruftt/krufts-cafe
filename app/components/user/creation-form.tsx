import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "@hooks";
import { auth } from "@lib/auth-client";
import { User } from "@schema";
import { Button } from "@ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@ui/field";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";
import { Spinner } from "@ui/spinner";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PasswordInput } from "./password-input";

// export default function CreationForm({ onOpen }: { onOpen: () => void }) {
export function CreationForm() {
	const [open, setOpen] = useState(false);
	const request = useRequest();

	const form = useForm<User.Create>({
		resolver: zodResolver(User.Create),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: User.Create) {
		await auth.signUp.email(data, {
			onRequest: request.onRequest,
			onResponse: request.onResponse,
			onSuccess: () => {
				setOpen(false);
			},
			onError: (ctx) => {
				request.onError(ctx.error.message);
			},
		});
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
			}}
		>
			<DialogTrigger render={<Button variant="link">Create Account</Button>} />
			<DialogContent>
				<DialogHeader className="text-center">
					<DialogTitle>Create New Account</DialogTitle>
				</DialogHeader>
				<form id="form-create-profile" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="form-create-profile-name">
										Name
									</FieldLabel>
									<Input
										{...field}
										id="form-create-profile-name"
										type="text"
										aria-invalid={fieldState.invalid}
										placeholder="John Smith"
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
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="form-create-profile-email">
										Email
									</FieldLabel>
									<Input
										{...field}
										id="form-create-profile-email"
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
									<FieldLabel htmlFor="form-create-profile-password">
										Password
									</FieldLabel>
									<PasswordInput
										{...field}
										id="form-create-profile-password"
										aria-invalid={fieldState.invalid}
										placeholder="xxxxxxxx"
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
				</form>
				<Separator />
				<DialogFooter>
					<div className="flex flex-col w-1/1 gap-4">
						<Button type="submit" form="form-create-profile" className="w-1/1">
							{request.inProgress ? (
								<div className="flex items-center gap-2">
									<Spinner />
									Creating Account...
								</div>
							) : (
								"Submit"
							)}
						</Button>
						{request.error && (
							<div
								role="alert"
								className="text-base text-center font-normal text-destructive"
							>
								{request.error}
							</div>
						)}
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
