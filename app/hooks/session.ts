import { sessionUserAtom } from "@atoms/user";
import { auth } from "@lib/auth-client";
import { useAtomValue } from "jotai";

export function useUser() {
	const serverUser = useAtomValue(sessionUserAtom);
	const { data: session, isPending } = auth.useSession();
	return isPending ? serverUser : (session?.user ?? null);
}
