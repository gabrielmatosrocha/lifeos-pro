import type { JournalEntry, JournalMood } from '@/features/journal/types/journal.types'
import type { SupabaseJournalEntry } from '@/features/journal/types/supabase-journal.types'
import { getActiveUserId } from '@/features/auth/services/auth.service'
import { getSupabaseClient } from '@/lib/supabase/client'

const JOURNAL_STORAGE_KEY_PREFIX = 'lifeos.journal'

function getCurrentUserStorageId() {
  if (typeof window === 'undefined') {
    return 'demo'
  }

  try {
    const session = window.localStorage.getItem('lifeos.local-session')
    if (!session) {
      return 'demo'
    }

    const parsed = JSON.parse(session) as { id?: string }
    return parsed.id ?? 'demo'
  } catch {
    return 'demo'
  }
}

function getStorageKey() {
  return `${JOURNAL_STORAGE_KEY_PREFIX}:${getCurrentUserStorageId()}`
}

export type JournalDraft = {
  title: string
  mood: JournalMood
  reflection: string
  learning?: string
  gratitude?: string
}

async function createJournalEntry(input: JournalDraft): Promise<JournalEntry> {
  const userId = await getActiveUserId()

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    user_id: userId,
    entry_date: new Date().toISOString().slice(0, 10),
    title: input.title.trim(),
    mood: input.mood,
    reflection: input.reflection.trim(),
    learning: input.learning?.trim() || null,
    gratitude: input.gratitude?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

function toJournalEntry(record: SupabaseJournalEntry): JournalEntry {
  return {
    id: record.id,
    user_id: record.user_id,
    entry_date: record.entry_date,
    title: record.title,
    mood: record.mood as JournalMood,
    reflection: record.reflection,
    learning: record.learning ?? null,
    gratitude: record.gratitude ?? null,
    created_at: record.created_at,
    updated_at: record.updated_at,
  }
}

export function loadJournalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') {
    return []
  }

  const stored = window.localStorage.getItem(getStorageKey())
  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored) as JournalEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    window.localStorage.removeItem(getStorageKey())
    return []
  }
}

export function persistJournalEntries(entries: JournalEntry[]) {
  if (typeof window === 'undefined') {
    return entries
  }

  window.localStorage.setItem(getStorageKey(), JSON.stringify(entries))
  return entries
}

export async function listJournalEntries(): Promise<JournalEntry[]> {
  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return loadJournalEntries()
  }

  const { data, error } = await supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false })

  if (error || !data) {
    return loadJournalEntries()
  }

  const nextEntries = (data ?? []).map((record) => toJournalEntry(record as SupabaseJournalEntry))
  const persistedEntries = nextEntries.length > 0 ? nextEntries : loadJournalEntries()
  persistJournalEntries(persistedEntries)
  return persistedEntries
}

export async function createJournalEntryRecord(input: JournalDraft): Promise<JournalEntry[]> {
  const entry = await createJournalEntry(input)
  const localEntries = [entry, ...loadJournalEntries()]
  persistJournalEntries(localEntries)

  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return localEntries
  }

  const { data, error } = await supabase.from('journal_entries').insert({
    user_id: userId,
    entry_date: entry.entry_date,
    title: entry.title,
    mood: entry.mood,
    reflection: entry.reflection,
    learning: entry.learning,
    gratitude: entry.gratitude,
  }).select('*').single()

  if (error || !data) {
    return localEntries
  }

  const remoteEntry = toJournalEntry(data as SupabaseJournalEntry)
  const nextEntries = [remoteEntry, ...localEntries.filter((item) => item.id !== entry.id)]
  persistJournalEntries(nextEntries)
  return nextEntries
}

export async function updateJournalEntryRecord(entryId: string, patch: Partial<Pick<JournalEntry, 'title' | 'mood' | 'reflection'>>): Promise<JournalEntry[]> {
  const nextPatch: Partial<JournalEntry> = {
    ...patch,
    updated_at: new Date().toISOString(),
  }

  if (patch.title !== undefined) {
    nextPatch.title = patch.title.trim()
  }

  if (patch.reflection !== undefined) {
    nextPatch.reflection = patch.reflection.trim()
  }

  const localEntries = loadJournalEntries().map((entry) => (entry.id === entryId ? { ...entry, ...nextPatch } : entry))
  persistJournalEntries(localEntries)

  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return localEntries
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .update(nextPatch)
    .eq('id', entryId)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error || !data) {
    return localEntries
  }

  const remoteRecord = toJournalEntry(data as SupabaseJournalEntry)
  const nextEntries = localEntries.map((entry) => (entry.id === entryId ? remoteRecord : entry))
  persistJournalEntries(nextEntries)
  return nextEntries
}

export async function deleteJournalEntry(entryId: string): Promise<JournalEntry[]> {
  const localEntries = loadJournalEntries().filter((entry) => entry.id !== entryId)
  persistJournalEntries(localEntries)

  const supabase = getSupabaseClient()
  const userId = await getActiveUserId()

  if (!supabase || userId === 'demo') {
    return localEntries
  }

  const { error } = await supabase.from('journal_entries').delete().eq('id', entryId).eq('user_id', userId)

  if (error) {
    return localEntries
  }

  return localEntries
}
