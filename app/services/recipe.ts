import { prisma } from "@lib/prisma";

export async function newRecipeName(userId: string) {
	const base = "New Recipe";
	const existing = await prisma.recipe.findMany({
		where: { userId, name: { startsWith: base } },
		select: { name: true },
	});

	if (!existing.length) return base;

	const numbers = existing
		.map((r) => {
			if (r.name === "New Recipe") return 1;
			const match = r.name.match(/^New Recipe \((\d+)\)$/);
			const num = match?.[1];
			return num ? Number.parseInt(num, 10) : -1;
		})
		.filter((n) => n >= 0);

	return `${base} (${Math.max(...numbers) + 1})`;
}

export async function updateRecipeSearch(recipeId: number) {
	const recipe = await prisma.recipe.findUniqueOrThrow({
		where: { id: recipeId },
		select: {
			name: true,
			tags: true,
			sections: {
				select: {
					ingredients: { select: { name: true } },
				},
			},
		},
	});

	const ingredientNames = recipe.sections
		.flatMap((s) => s.ingredients)
		.map((i) => i.name);

	const search = [recipe.name, ...recipe.tags, ...ingredientNames]
		.join(" ")
		.toLowerCase();

	await prisma.recipe.update({
		where: { id: recipeId },
		data: { search },
	});
}


interface IdSlugLocator {
	userId_slug: {
		userId: string;
		slug: string;
	}
}

interface RecipeIdLocator {
	id: number;
}


export async function findRecipe(where: IdSlugLocator | RecipeIdLocator) {
	return prisma.recipe.findUnique({
		where,
		include: {
			user: {
				select: {
					name: true,
					handle: true,
				},
			},
			sections: {
				orderBy: { index: "asc" },
				include: {
					ingredients: { orderBy: { index: "asc" } },
					instructions: { orderBy: { index: "asc" } },
				},
			},
		},
	});
}


interface UserIdLocator {
	userId: string;
}


export async function findRecipes(where?: UserIdLocator) {
	return prisma.recipe.findMany({
		where,
		include: {
			user: {
				select: {
					handle: true,
					name: true,
				},
			},
		},
	});
}


export async function findBookmarkedRecipes(where?: UserIdLocator) {
	return await prisma.bookmark.findMany({
		where,
		include: {
			recipe: {
				select: {
					id: true,
					name: true,
					tags: true,
					duration: true,
					slug: true,
					search: true,
					description: true,
					intro: true,
					userId: true,
					user: { select: {
						handle: true,
						name: true,
					} },
				},
			},
		},
	});
}
