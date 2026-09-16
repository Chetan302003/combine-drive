import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const folders = await prisma.folder.findMany({
    where: { deletedAt: null, providerFolderId: { not: null } },
    select: { id: true, name: true, isExternal: true, parentId: true, providerFolderId: true }
  })

  console.log(`Found ${folders.length} active folders with providerFolderId.`)
  for (const f of folders) {
    console.log(`- [${f.id}] ${f.name} (isExternal: ${f.isExternal}, parentId: ${f.parentId})`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
