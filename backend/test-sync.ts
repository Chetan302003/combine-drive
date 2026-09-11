import { PrismaClient } from '@prisma/client'
import { syncGoogleAppFolderFiles } from './src/modules/google/google.service'

const prisma = new PrismaClient()

async function main() {
  const account = await prisma.connectedAccount.findFirst({
    where: { provider: 'google_drive', status: 'connected' }
  })
  if (!account) {
    console.log('No connected account found')
    return
  }
  
  // ensure it has full_drive_sync for the test
  let scopes = account.scopes as string[] || []
  if (!scopes.includes('feature:full_drive_sync')) {
    scopes.push('feature:full_drive_sync')
    await prisma.connectedAccount.update({
      where: { id: account.id },
      data: { scopes }
    })
  }

  try {
    console.log(`Syncing account ${account.id} for user ${account.userId}`)
    await syncGoogleAppFolderFiles(account.id, account.userId)
    console.log('Sync succeeded!')
  } catch (error: any) {
    console.error('Sync failed with error:')
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2))
    } else {
      console.error(error.message)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
