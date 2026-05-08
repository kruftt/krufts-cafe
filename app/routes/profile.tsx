import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { PasswordForm, ProfileForm } from "@components/user";
import { requireAuth } from "@lib/auth-loader";
import type { User } from "@schema";
import { redirect } from "react-router";
import type { Route } from "./+types/profile";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await requireAuth(request);
	if (!session.user) throw redirect("/");
	return { user: session.user };
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;

	return (
		<ContentContainer>
			<ContentHeader>
				<h2 className="text-3xl font-bold">User Profile</h2>
			</ContentHeader>
			<ContentPane className="max-w-120 m-auto">
				<ProfileForm user={user as User.Model} />
			</ContentPane>
			<ContentPane className="max-w-120 mx-auto mt-6">
				<PasswordForm user={user as User.Model} />
			</ContentPane>
		</ContentContainer>
	);
}
