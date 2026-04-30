import { zodResolver } from "@hookform/resolvers/zod";
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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

// export default function CreationForm({ onOpen }: { onOpen: () => void }) {
export default function CreationForm() {
	const [open, setOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [requesting, setRequesting] = useState(false);
	const [requestError, setRequestError] = useState("");

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
			onRequest: (ctx) => {
				setRequesting(true);
			},
			onSuccess: (ctx) => {
				setRequesting(false);
				setOpen(false);
			},
			onError: (ctx) => {
				setRequestError(ctx.error.message);
				setRequesting(false);
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
										disabled={requesting}
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
									<FieldLabel htmlFor="form-create-profile-password">
										Password
									</FieldLabel>
									<div className="relative">
										<Input
											{...field}
											id="form-create-profile-password"
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
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
				<Separator />
				<DialogFooter>
					<div className="flex flex-col w-1/1 gap-4">
						<Button type="submit" form="form-create-profile" className="w-1/1">
							{requesting ? (
								<div className="flex items-center gap-2">
									<Spinner />
									Creating Account...
								</div>
							) : (
								"Submit"
							)}
						</Button>
						{requestError && (
							<div
								role="alert"
								className="text-base text-center font-normal text-destructive"
							>
								{requestError}
							</div>
						)}
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
