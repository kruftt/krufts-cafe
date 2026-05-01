import { prisma } from "@lib/prisma";

export async function newRecipeName(userId: string) {
	const base = "New Recipe";
	const existing = await prisma.recipe.findMany({
		where: { userId, name: { startsWith: base } },
		select: { name: true }
	})

	if (!existing.length) return base;

	const numbers = existing
  	.map(r => {
			if (r.name === "New Recipe") return 1
			const match = r.name.match(/^New Recipe \((\d+)\)$/)
			const num = match?.[1]
			return (num) ? Number.parseInt(num, 10) : -1
		})
  	.filter(n => n >= 0)

	return `${base} (${Math.max(...numbers) + 1})`
}
