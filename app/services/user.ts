import { prisma } from "@lib/prisma"

export async function generateHandle(name: string) {
  const base = name.toLowerCase().replace(' ', '-')
  
  const existing = await prisma.user.findMany({
    where: { handle: { startsWith: base }},
    select: { handle: true }
  })

  if (!existing.length) return base

  const indices = existing
    .map(user => parseInt(user.handle.replace(`${base}-`, '') || '1', 10))
    .filter(n => !Number.isNaN(n))
  
  return `${base}-${Math.max(...indices) + 1}`
}


export async function getUser(handle: string) {
  return prisma.user.findUnique({
    where: { handle },
  });
}


export async function getPins(userId: string) {
  return prisma.pin.findMany({
    where: { userId },
    include: {
      recipe: {
        select: {
          id: true,
          name: true,
          slug: true,
          user: { select: { handle: true } },
        },
      },
    },
  });
}

export async function getBookmarks(userId: string) {
  return prisma.bookmark.findMany({
    where: { userId },
    select: { recipeId: true },
  });
}
