export type SupabaseJournalEntry = {
  id: string
  user_id: string
  entry_date: string
  title: string
  mood: string
  reflection: string
  learning?: string | null
  gratitude?: string | null
  created_at?: string
  updated_at?: string
}
