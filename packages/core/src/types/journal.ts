export type JournalMood = 'Bom' | 'Excelente' | 'Neutro' | 'Difícil'

export type JournalEntry = {
  id: string
  user_id: string
  entry_date: string
  title: string
  mood: JournalMood
  reflection: string
  learning?: string | null
  gratitude?: string | null
  created_at?: string
  updated_at?: string
}

export type JournalDraft = {
  title: string
  mood: JournalMood
  reflection: string
  learning?: string
  gratitude?: string
}
