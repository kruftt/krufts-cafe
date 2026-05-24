import { auth } from "@lib/auth-client";
import type { User } from "@schema";
import { useMutation } from "@tanstack/react-query";

export function useProfile() {
	return useMutation({
		mutationFn: async (data: User.Names) => {
			const result = await auth.updateUser(data);
			if (result.error) throw new Error(result.error.message);
		},
	});
}
