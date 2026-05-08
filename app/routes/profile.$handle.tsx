import { ContentContainer, ContentHeader, ContentPane } from "@components/app";
import { requireAuth } from "@lib/auth-loader";
import { prisma } from "@lib/prisma";
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

	return (
		<ContentContainer>
			<ContentHeader>
				<h1>Profile</h1>
			</ContentHeader>
			<ContentPane>
				<div>{user.name}</div>
				<div>{user.handle}</div>
				<div>{user.email}</div>
			</ContentPane>
		</ContentContainer>
	);
}
