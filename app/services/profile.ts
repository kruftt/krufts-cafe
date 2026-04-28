import { prisma } from "@lib/prisma";

export async function ensureProfile(user: { id: string; name: string }) {
	return prisma.profile.upsert({
		where: { userId: user.id },
		update: {},
		create: { userId: user.id, name: user.name },
	});
}