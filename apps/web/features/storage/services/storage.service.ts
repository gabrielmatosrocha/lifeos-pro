import { getSupabaseClient } from '@/lib/supabase/client'

export type StorageUploadResult = {
  path: string
  publicUrl?: string
  source: 'supabase' | 'local'
}

export async function uploadUserFile(input: {
  bucket: string
  path: string
  file: File
}): Promise<StorageUploadResult> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return { path: `local://${input.bucket}/${input.path}`, source: 'local' }
  }

  const { error } = await supabase.storage.from(input.bucket).upload(input.path, input.file, { upsert: true })
  if (error) {
    return { path: `local://${input.bucket}/${input.path}`, source: 'local' }
  }

  const { data } = supabase.storage.from(input.bucket).getPublicUrl(input.path)
  return { path: input.path, publicUrl: data.publicUrl, source: 'supabase' }
}

export async function removeUserFile(bucket: string, path: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { source: 'local' as const, error: null }
  }

  const { error } = await supabase.storage.from(bucket).remove([path])
  return { source: error ? 'local' as const : 'supabase' as const, error }
}
