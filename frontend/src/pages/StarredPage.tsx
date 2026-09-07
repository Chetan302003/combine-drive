import { Star } from 'lucide-react'
import { FileTable } from '@/components/drive/FileTable'
import { PageHeader } from '@/components/drive/PageHeader'
import type { FileItem } from '@/data/drive-data'
import { apiFetch, formatBytes, formatDate } from '@/lib/api'
import { useEffect, useState } from 'react'

type BackendFile = {
  id: string
  name: string
  mimeType: string
  sizeBytes: string
  createdAt: string
  starredAt?: string | null
  connectedAccount?: { email: string; provider: string }
  folder?: { id: string; name: string } | null
}

function mimeToKind(mimeType: string): FileItem['kind'] {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.includes('pdf')) return 'pdf'
  return 'doc'
}

function mapFile(file: BackendFile): FileItem {
  const provider = file.connectedAccount?.provider === 's3' ? 'S3 Storage' : 'Google Drive'
  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    createdAt: file.createdAt,
    starred: true,
    starredDate: file.starredAt ? formatDate(file.starredAt) : undefined,
    date: formatDate(file.createdAt),
    size: formatBytes(file.sizeBytes),
    access: file.connectedAccount?.email ?? provider,
    accountEmail: file.connectedAccount?.email,
    accountProvider: provider,
    kind: mimeToKind(file.mimeType),
    shared: 1,
    folderId: file.folder?.id,
    folderName: file.folder?.name,
  }
}

export function StarredPage() {
  const [starred, setStarred] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<{ files: BackendFile[] }>('/files?starred=1')
      .then((data) => setStarred(data.files.map(mapFile)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader title="Starred" description="Pinned files for quick access." />
      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-semibold text-yellow-800">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
        {loading ? 'Loading starred files...' : `${starred.length} starred file${starred.length === 1 ? '' : 's'}`}
      </div>
      {!loading && starred.length === 0 ? <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No starred files yet. Open a file menu in All Files and choose Add to Starred.</p> : null}
      {starred.length > 0 ? <FileTable files={starred} mode="starred" /> : null}
    </>
  )
}
