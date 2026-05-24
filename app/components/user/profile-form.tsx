import { FormField, SubmitButton } from "@components/controls";
import { FieldGroup } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile } from "@hooks";
import type { SessionUser } from "@lib/auth-client";
import { User } from "@schema";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function ProfileForm({ user }: { user: SessionUser }) {
	const mutation = useProfile();
	const { mutate, isPending, isSuccess, error } = mutation;

	const form = useForm<User.Names>({
		resolver: zodResolver(User.Names),
		defaultValues: {
			name: user.name,
			// biome-ignore lint: guaranteed by db hook
			handle: user.handle!,
		},
	});

	useEffect(() => {
		const { unsubscribe } = form.watch(() => mutation.reset());
		return unsubscribe;
	}, [form.watch, mutation.reset]);

	function submit(data: User.Names) {
		mutate(data);
	}

	return (
		<form id="form-profile-names" onSubmit={form.handleSubmit(submit)}>
			<FieldGroup>
				<FormField name="name" control={form.control} label="Display Name" id="form-profile-names-name" description="How your name is displayed to other users.">
					{(field, invalid) => (
						<Input {...field} id="form-profile-names-name" type="text" aria-invalid={invalid} placeholder="Display Name" autoComplete="off" disabled={isPending} />
					)}
				</FormField>
				<FormField name="handle" control={form.control} label="Handle" id="form-profile-names-handle" description="Your handle is used in your recipe URLs.">
					{(field, invalid) => (
						<Input {...field} id="form-profile-names-handle" type="text" aria-invalid={invalid} placeholder="User Handle" autoComplete="off" disabled={isPending} />
					)}
				</FormField>
			</FieldGroup>
			<SubmitButton
				className="mt-6"
				form="form-profile-names"
				inProgress={isPending}
				success={isSuccess}
				error={error?.message ?? ""}
			>
				Save Changes
			</SubmitButton>
		</form>
	);
}
