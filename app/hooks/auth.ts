import { auth } from "@lib/auth-client";
import { User } from "@schema";
import { useMutation } from "@tanstack/react-query";
import { useRevalidator } from "react-router";
import * as z from "zod";
import { usePins } from "./pins";

const changePasswordSchema = z.object({
	currentPassword: User.Password,
	newPassword: User.Password,
});

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export function useLogin(onSuccess?: () => void) {
	const { mergePins } = usePins();
	const revalidator = useRevalidator();

	return useMutation({
		mutationFn: async (data: User.Login) => {
			const result = await auth.signIn.email(data);
			if (result.error) throw new Error(result.error.message);
		},
		onSuccess: async () => {
			await mergePins();
			onSuccess?.();
			revalidator.revalidate();
		},
	});
}

export function useCreateUser() {
	return useMutation({
		mutationFn: async (data: User.Create) => {
			const result = await auth.signUp.email(data);
			if (result.error) throw new Error(result.error.message);
		},
	});
}

export function useChangePassword() {
	return useMutation({
		mutationFn: async (data: ChangePasswordInput) => {
			const result = await auth.changePassword({ ...data, revokeOtherSessions: true });
			if (result.error) throw new Error(result.error.message);
		},
	});
}
