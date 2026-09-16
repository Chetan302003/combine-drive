import './src/config/env'
import { PrismaClient } from '@prisma/client'
import { google } from 'googleapis'
import { getAuthedGoogleClient, ensureGoogleAppFolder } from './src/modules/google/google.service'

const prisma = new PrismaClient()

async function main() {
  const account = await prisma.connectedAccount.findFirst({
    where: { provider: 'google_drive', status: 'connected' }
  })
  if (!account) return console.log("No account")

  const auth = await getAuthedGoogleClient(account as any)
  const drive = google.drive({ version: 'v3', auth })
  const appFolderId = await ensureGoogleAppFolder(account as any)

  const folders = await prisma.folder.findMany({
    where: { deletedAt: null, providerFolderId: { not: null } },
  })

  console.log(`Checking ${folders.length} folders... appFolderId is ${appFolderId}`)

  let deletedCount = 0
  for (const f of folders) {
    if (!f.providerFolderId) continue
    try {
      const res = await drive.files.get({ fileId: f.providerFolderId, fields: 'parents' })
      const parents = res.data.parents || []

      // We'll just do a shallow check: is the direct parent the appFolderId?
      // Since virtual folders are created directly under CombinedDrive or other virtual folders.
      // If it's another virtual folder, its parent is also in the DB.
      // Let's just check if it's external by tracing up.
      let isExternal = true;
      let currentParents = parents;

      let depth = 0;
      while (currentParents.length > 0 && depth < 10) {
        if (currentParents.includes(appFolderId)) {
          isExternal = false;
          break;
        }
        // Fetch parent's parents
        const nextParent = currentParents[0];
        try {
          const pRes = await drive.files.get({ fileId: nextParent, fields: 'parents' });
          currentParents = pRes.data.parents || [];
        } catch (e) {
          break; // No access to parent (e.g. shared with me root)
        }
        depth++;
      }

      console.log(`- ${f.name} => external? ${isExternal} (parents: ${parents.join(',')})`)
      if (isExternal) {
        await prisma.folder.update({
          where: { id: f.id },
          data: { deletedAt: new Date() }
        })
        deletedCount++
      }
    } catch (e: any) {
      console.log(`- ${f.name} => error fetching from drive: ${e.message}`)
      // Soft delete if it doesn't exist anymore or no permission
      await prisma.folder.update({
        where: { id: f.id },
        data: { deletedAt: new Date() }
      })
      deletedCount++
    }
  }

  console.log(`Cleaned up ${deletedCount} external/missing folders.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
