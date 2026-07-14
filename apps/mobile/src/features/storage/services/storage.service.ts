export type StorageUploadDraft = {
  userId: string
  bucket: 'profile' | 'journal' | 'activity'
  path: string
  uri: string
}

export async function prepareStorageUpload(draft: StorageUploadDraft) {
  return {
    ...draft,
    status: 'supabase-storage-ready' as const,
  }
}
