import LoginForm from "@components/user/login-form";
import { auth } from "@lib/auth-server";
import { redirect, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/login";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({ headers: request.headers });
	const url = new URL(request.url);
	const redirectTo = url.searchParams.get("redirect") ?? "/";
	if (session) throw redirect(redirectTo);
	return { redirectTo };
}

export default function LoginPage() {
	const { redirectTo } = useLoaderData();
	const navigate = useNavigate();

	return (
		<div className="w-1/1 pt-16 flex justify-center">
			<div className="max-w-80 grow">
				<LoginForm onSuccess={() => navigate(redirectTo)} />
			</div>
		</div>
	);
}
