import { prisma } from "@lib/prisma"

export async function generateHandle(name: string) {
  const base = name.toLowerCase().replace(' ', '-')
  
  const existing = await prisma.user.findMany({
    where: { handle: { startsWith: base }},
    select: { handle: true }
  })

  if (!existing.length) return base

  const indices = existing
    .map(user => parseInt(user.handle.replace(base + '-', '') || '1'))
    .filter(n => !isNaN(n))
  
  return `${base}-${Math.max(...indices) + 1}`
}
