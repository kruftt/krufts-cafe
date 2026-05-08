import {
	ContentContainer,
	ContentHeader,
	ContentPane,
	SubmitButton,
} from "@components/app";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@components/ui/field";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "@hooks";
import { auth } from "@lib/auth-client";
import { requireAuth } from "@lib/auth-loader";
import { prisma } from "@lib/prisma";
import { User } from "@schema";
import { Controller, useForm } from "react-hook-form";
import { redirect } from "react-router";
import type { Route } from "./+types/profile.$handle";

export async function loader({ request, params }: Route.LoaderArgs) {
	const session = await requireAuth(request);

	const user = await prisma.user.findUnique({
		where: { handle: params.handle },
	});

	if (!user) throw redirect("/");
	if (user.id !== session.user.id) throw redirect("/my-recipes");

	return { user };
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;
	const namesRequest = useRequest();

	const namesForm = useForm<User.Names>({
		resolver: zodResolver(User.Names),
		defaultValues: {
			name: user.name,
			handle: user.handle,
		},
	});

	async function submitNames(data: User.Names) {
		await auth.updateUser(data, {
			onRequest: namesRequest.onRequest,
			onResponse: namesRequest.onResponse,
			onError: (ctx) => namesRequest.onError(ctx.error.message),
		});
	}

	return (
		<ContentContainer>
			<ContentHeader>
				<h2 className="text-3xl font-bold">User Profile</h2>
			</ContentHeader>
			<ContentPane className="max-w-120 m-auto">
				<form
					id="form-profile-names"
					onSubmit={namesForm.handleSubmit(submitNames)}
				>
					<FieldGroup>
						<Controller
							name="name"
							control={namesForm.control}
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
										disabled={namesRequest.inProgress}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="handle"
							control={namesForm.control}
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
										disabled={namesRequest.inProgress}
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
            request={namesRequest}
          >
            Save Changes
          </SubmitButton>
				</form>
				{/* <div>{user.name}</div>
				<div>{user.handle}</div>
				<div>{user.email}</div> */}
			</ContentPane>
		</ContentContainer>
	);
}
