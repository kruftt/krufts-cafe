import { FormField, PasswordInput, SubmitButton } from "@components/controls";
import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { FieldGroup } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@hooks";
import { User } from "@schema";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function CreateUser() {
	const [open, setOpen] = useState(false);
	const { mutate, isPending, error } = useCreateUser();

	const form = useForm<User.Create>({
		resolver: zodResolver(User.Create),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	function onSubmit(data: User.Create) {
		mutate(data, { onSuccess: () => setOpen(false) });
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
			}}
		>
			<DialogTrigger
				render={
					<Button className="text-popover-foreground" variant="link">
						Create Account
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader className="text-center">
					<DialogTitle>Create New Account</DialogTitle>
				</DialogHeader>
				<form id="form-create-profile" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<FormField name="name" control={form.control} label="Name" id="form-create-profile-name">
							{(field, invalid) => (
								<Input {...field} id="form-create-profile-name" type="text" aria-invalid={invalid} placeholder="John Smith" autoComplete="off" disabled={isPending} />
							)}
						</FormField>
						<FormField name="email" control={form.control} label="Email" id="form-create-profile-email">
							{(field, invalid) => (
								<Input {...field} id="form-create-profile-email" type="email" aria-invalid={invalid} placeholder="email@domain.com" autoComplete="off" disabled={isPending} />
							)}
						</FormField>
						<FormField name="password" control={form.control} label="Password" id="form-create-profile-password">
							{(field, invalid) => (
								<PasswordInput {...field} id="form-create-profile-password" aria-invalid={invalid} placeholder="xxxxxxxx" autoComplete="off" disabled={isPending} />
							)}
						</FormField>
					</FieldGroup>
				</form>
				<Separator />
				<DialogFooter>
					<SubmitButton
						className="w-1/1"
						form="form-create-profile"
						inProgress={isPending}
						error={error?.message ?? ""}
					>
						Create Account
					</SubmitButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
