import { google } from 'googleapis'
import type { ConnectedAccount, ProviderConfig } from '@prisma/client'
import { prisma } from '../../config/prisma.js'
import { decryptText, encryptText } from '../../utils/crypto.js'
import { sendAccountDisconnectedEmail } from '../../lib/email.js'

const googleDriveFolderMimeType = 'application/vnd.google-apps.folder'
const appFolderName = 'CombinedDrive'

export function createOAuthClient(config: ProviderConfig) {
  return new google.auth.OAuth2(decryptText(config.clientIdEncrypted), decryptText(config.clientSecretEncrypted), config.redirectUri)
}

export async function getAuthedGoogleClient(account: ConnectedAccount) {
  if (!account.accessTokenEncrypted || !account.refreshTokenEncrypted || !account.tokenExpiresAt) throw new Error('Google account tokens are missing.')
  if (!account.providerConfigId) throw new Error('Google provider config is missing.')
  const config = await prisma.providerConfig.findUniqueOrThrow({ where: { id: account.providerConfigId } })
  const client = createOAuthClient(config)
  client.setCredentials({
    access_token: decryptText(account.accessTokenEncrypted),
    refresh_token: decryptText(account.refreshTokenEncrypted),
    expiry_date: account.tokenExpiresAt.getTime(),
  })

  if (account.tokenExpiresAt.getTime() < Date.now() + 60_000) {
    try {
      const result = await client.refreshAccessToken()
      const credentials = result.credentials
      if (credentials.access_token) {
        await prisma.connectedAccount.update({
          where: { id: account.id },
          data: {
            accessTokenEncrypted: encryptText(credentials.access_token),
            tokenExpiresAt: new Date(credentials.expiry_date ?? Date.now() + 3600_000),
            status: 'connected',
            lastError: null,
          },
        })
        client.setCredentials(credentials)
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Token refresh failed'
      await prisma.connectedAccount.update({
        where: { id: account.id },
        data: {
          status: 'error',
          lastError: errorMsg,
        },
      }).catch(() => {})

      // Alert user via email about disconnected Google account
      prisma.user.findUnique({
        where: { id: account.userId },
        select: { name: true, email: true },
      }).then((user) => {
        if (user) {
          sendAccountDisconnectedEmail({
            to: user.email,
            userName: user.name,
            accountEmail: account.email,
            reason: errorMsg,
          }).catch((emailErr) => console.warn('[google] Failed to send re-auth alert email:', emailErr))
        }
      }).catch(() => {})

      throw new Error(`Google account authorization expired or revoked: ${errorMsg}`)
    }
  }

  return client
}

export async function syncGoogleQuota(accountId: string) {
  const account = await prisma.connectedAccount.findUniqueOrThrow({ where: { id: accountId } })
  const auth = await getAuthedGoogleClient(account)
  const drive = google.drive({ version: 'v3', auth })
  const about = await drive.about.get({ fields: 'storageQuota,user' })
  const quota = about.data.storageQuota
  const total = quota?.limit ? BigInt(quota.limit) : null
  const used = quota?.usage ? BigInt(quota.usage) : 0n
  return prisma.storageAccount.upsert({
    where: { connectedAccountId: accountId },
    create: {
      connectedAccountId: accountId,
      totalBytes: total,
      usedBytes: used,
      availableBytes: total === null ? null : total - used,
      trashBytes: quota?.usageInDriveTrash ? BigInt(quota.usageInDriveTrash) : null,
      lastSyncedAt: new Date(),
    },
    update: {
      totalBytes: total,
      usedBytes: used,
      availableBytes: total === null ? null : total - used,
      trashBytes: quota?.usageInDriveTrash ? BigInt(quota.usageInDriveTrash) : null,
      lastSyncedAt: new Date(),
    },
  })
}

function escapeDriveQueryValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export async function ensureGoogleAppFolder(account: ConnectedAccount) {
  const auth = await getAuthedGoogleClient(account)
  const drive = google.drive({ version: 'v3', auth })
  const queryName = escapeDriveQueryValue(appFolderName)
  const existing = await drive.files.list({
    q: `name = '${queryName}' and mimeType = '${googleDriveFolderMimeType}' and 'root' in parents and trashed = false`,
    spaces: 'drive',
    fields: 'files(id,name)',
    pageSize: 1,
  })
  const folderId = existing.data.files?.[0]?.id ?? (await drive.files.create({
    requestBody: { name: appFolderName, mimeType: googleDriveFolderMimeType, parents: ['root'] },
    fields: 'id',
  })).data.id

  if (!folderId) throw new Error('Failed to create Google Drive app folder.')
  return folderId
}

export type GoogleAppFolderSyncResult = {
  accountId: string
  created: number
  updated: number
  deleted: number
}

type DriveFileMetadata = {
  id: string
  name: string
  mimeType: string
  sizeBytes: bigint
  parentId: string
}

export async function syncGoogleAppFolderFiles(accountId: string, userId: string): Promise<GoogleAppFolderSyncResult> {
  const account = await prisma.connectedAccount.findFirstOrThrow({ where: { id: accountId, userId, provider: 'google_drive', status: 'connected' } })
  const auth = await getAuthedGoogleClient(account)
  const drive = google.drive({ version: 'v3', auth })
  const appFolderId = await ensureGoogleAppFolder(account)

  const userFolders = await prisma.folder.findMany({
    where: { userId, connectedAccountId: account.id, deletedAt: null },
    select: { id: true, providerFolderId: true, parentId: true }
  })

  const isFullDrive = Array.isArray(account.scopes) && (account.scopes as string[]).includes('feature:full_drive_sync')

  // When Full Drive is enabled, sync external Google Drive folders into the Folder table
  if (isFullDrive) {
    type DriveFolderMetadata = { id: string; name: string; parentId: string | null }
    const driveFolders: DriveFolderMetadata[] = []
    let folderPageToken: string | undefined

    do {
      const folderRes = await drive.files.list({
        q: `mimeType = '${googleDriveFolderMimeType}' and trashed = false`,
        spaces: 'drive',
        fields: 'nextPageToken,files(id,name,parents)',
        pageSize: 1000,
        pageToken: folderPageToken,
      })
      for (const f of folderRes.data.files ?? []) {
        if (!f.id || !f.name || f.id === appFolderId) continue
        const rawParent = f.parents?.[0] ?? null
        driveFolders.push({ id: f.id, name: f.name, parentId: rawParent })
      }
      folderPageToken = folderRes.data.nextPageToken ?? undefined
    } while (folderPageToken)

    const existingFolders = await prisma.folder.findMany({
      where: { userId, connectedAccountId: account.id }
    })
    const existingFoldersByGId = new Map(existingFolders.map((f) => [f.providerFolderId, f]))

    // Upsert each external Google Drive folder
    for (const df of driveFolders) {
      const existingF = existingFoldersByGId.get(df.id)
      if (!existingF) {
        const createdFolder = await prisma.folder.create({
          data: {
            userId,
            connectedAccountId: account.id,
            provider: 'google_drive',
            providerFolderId: df.id,
            name: df.name,
            color: '#3b82f6',
            deletedAt: null,
          }
        })
        existingFoldersByGId.set(df.id, createdFolder)
      } else {
        if (existingF.name !== df.name || existingF.deletedAt !== null) {
          await prisma.folder.update({
            where: { id: existingF.id },
            data: { name: df.name, deletedAt: null }
          })
        }
      }
    }

    // Connect folder parentId hierarchy
    for (const df of driveFolders) {
      const currentF = existingFoldersByGId.get(df.id)
      if (!currentF) continue
      let resolvedParentDbId: string | null = null
      if (df.parentId && df.parentId !== appFolderId && df.parentId !== 'root') {
        const parentF = existingFoldersByGId.get(df.parentId)
        if (parentF) resolvedParentDbId = parentF.id
      }
      if (currentF.parentId !== resolvedParentDbId) {
        await prisma.folder.update({
          where: { id: currentF.id },
          data: { parentId: resolvedParentDbId }
        })
      }
    }
  }

  // Refresh active user folders after external folders sync
  const allUserFolders = await prisma.folder.findMany({
    where: { userId, connectedAccountId: account.id, deletedAt: null },
    select: { id: true, providerFolderId: true }
  })
  const folderIdMap = new Map(allUserFolders.map((f) => [f.providerFolderId, f.id]))
  const dedicatedParentIds = new Set([appFolderId, ...allUserFolders.map((f) => f.providerFolderId).filter(Boolean)])

  const parentIds = [
    appFolderId,
    ...allUserFolders.map((f) => f.providerFolderId).filter((id): id is string => !!id)
  ]

  const driveFiles: DriveFileMetadata[] = []
  let pageToken: string | undefined

  let q: string
  if (isFullDrive) {
    q = `mimeType != '${googleDriveFolderMimeType}' and trashed = false`
  } else {
    const parentsQuery = parentIds.map((id) => `'${id}' in parents`).join(' or ')
    q = `(${parentsQuery}) and mimeType != '${googleDriveFolderMimeType}' and trashed = false`
  }

  do {
    const response = await drive.files.list({
      q,
      spaces: 'drive',
      fields: 'nextPageToken,files(id,name,mimeType,size,parents)',
      pageSize: 1000,
      pageToken,
    })
    for (const file of response.data.files ?? []) {
      if (!file.id || !file.name || !file.mimeType) continue
      const parentId = file.parents?.[0] ?? appFolderId
      driveFiles.push({ id: file.id, name: file.name, mimeType: file.mimeType, sizeBytes: BigInt(file.size ?? 0), parentId })
    }
    pageToken = response.data.nextPageToken ?? undefined
  } while (pageToken)

  const existingFiles = await prisma.file.findMany({ where: { userId, connectedAccountId: account.id, provider: 'google_drive' } })
  const existingByProviderId = new Map(existingFiles.map((file) => [file.providerFileId, file]))
  const driveFileIds = new Set(driveFiles.map((file) => file.id))
  let created = 0
  let updated = 0
  let deleted = 0

  for (const driveFile of driveFiles) {
    const isInsideDedicated = driveFile.parentId === appFolderId || folderIdMap.has(driveFile.parentId)
    // If the file's parent is an existing synced folder in DB, link it to that folder
    const dbFolderId = driveFile.parentId === appFolderId ? null : (folderIdMap.get(driveFile.parentId) ?? null)
    const fileChecksum = isInsideDedicated && driveFile.parentId === appFolderId ? null : 'external_drive'
    const existing = existingByProviderId.get(driveFile.id)
    if (!existing) {
      await prisma.file.create({
        data: {
          userId,
          connectedAccountId: account.id,
          provider: 'google_drive',
          providerFileId: driveFile.id,
          name: driveFile.name,
          mimeType: driveFile.mimeType,
          sizeBytes: driveFile.sizeBytes,
          checksum: fileChecksum,
          status: 'active',
          folderId: dbFolderId,
        },
      })
      created += 1
      continue
    }

    const needsUpdate = existing.name !== driveFile.name ||
      existing.mimeType !== driveFile.mimeType ||
      existing.sizeBytes !== driveFile.sizeBytes ||
      existing.status !== 'active' ||
      existing.deletedAt !== null ||
      existing.folderId !== dbFolderId ||
      existing.checksum !== fileChecksum

    if (needsUpdate) {
      await prisma.file.update({
        where: { id: existing.id },
        data: {
          name: driveFile.name,
          mimeType: driveFile.mimeType,
          sizeBytes: driveFile.sizeBytes,
          checksum: fileChecksum,
          status: 'active',
          deletedAt: null,
          folderId: dbFolderId,
        },
      })
      updated += 1
    }
  }

  const missingActiveIds = existingFiles.filter((file) => file.status === 'active' && !driveFileIds.has(file.providerFileId)).map((file) => file.id)
  if (missingActiveIds.length > 0) {
    const result = await prisma.file.updateMany({ where: { id: { in: missingActiveIds }, userId }, data: { status: 'deleted', deletedAt: new Date() } })
    deleted = result.count
  }

  await syncGoogleQuota(account.id).catch(() => undefined)
  return { accountId: account.id, created, updated, deleted }
}
