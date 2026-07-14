import { supabase } from '@/lib/supabase/client'
import { authService } from '@/features/auth/services/auth.service'
import { secureStorageAdapter } from '@/features/persistence/storage/secure-storage.adapter'
import type {
  GoalDraft,
  GoalRecord,
  HabitDraft,
  HabitEngineState,
  HabitEvent,
  HabitRecord,
  JournalDraft,
  JournalEntry,
} from '@lifeos/core'
import { nowIso, todayIso } from '@lifeos/core'

const DEMO_USER_ID = 'demo'

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

async function getActiveUserId() {
  return (await authService.getCurrentUser())?.id ?? DEMO_USER_ID
}

function key(collection: string, userId: string) {
  return `lifeos.${collection}:${userId}`
}

async function readCollection<T>(collection: string, userId: string): Promise<T[]> {
  const stored = await secureStorageAdapter.getItem(key(collection, userId))
  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored) as T[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    await secureStorageAdapter.removeItem(key(collection, userId))
    return []
  }
}

async function writeCollection<T>(collection: string, userId: string, records: T[]) {
  await secureStorageAdapter.setItem(key(collection, userId), JSON.stringify(records))
  return records
}

export const demoHabits: HabitRecord[] = [
  {
    id: 'habit-water',
    user_id: DEMO_USER_ID,
    title: 'Beber água',
    description: 'Base simples para energia e clareza.',
    frequency: 'daily',
    checklist: ['2 litros no dia', 'Um copo ao acordar'],
    streak: 8,
    best_streak: 14,
    weight: 6,
    priority: 'alta',
    status: 'active',
    memory_signal: 'Saúde responde bem a hábitos simples.',
  },
  {
    id: 'habit-study',
    user_id: DEMO_USER_ID,
    title: 'Estudar com foco',
    description: 'Bloco curto para sustentar metas de conhecimento.',
    frequency: 'daily',
    checklist: ['30 minutos', 'Anotar uma ideia aplicável'],
    streak: 3,
    best_streak: 9,
    weight: 8,
    priority: 'alta',
    status: 'active',
  },
]

export const demoGoals: GoalRecord[] = [
  {
    id: 'goal-run-10k',
    user_id: DEMO_USER_ID,
    title: 'Correr 10 km',
    description: 'Construir resistência com consistência.',
    deadline: 'Outubro de 2026',
    priority: 'alta',
    pillar: 'Saúde',
    horizon: '6 meses',
    target_value: 10,
    current_value: 5,
    unit: 'km',
    status: 'active',
  },
  {
    id: 'goal-books',
    user_id: DEMO_USER_ID,
    title: 'Ler 12 livros este ano',
    description: 'Aumentar repertório e clareza.',
    deadline: 'Dezembro de 2026',
    priority: 'media',
    pillar: 'Conhecimento',
    horizon: '12 meses',
    target_value: 12,
    current_value: 3,
    unit: 'livros',
    status: 'active',
  },
]

export const demoJournalEntries: JournalEntry[] = [
  {
    id: 'journal-demo',
    user_id: DEMO_USER_ID,
    entry_date: todayIso(),
    title: 'Primeiro registro mobile',
    mood: 'Bom',
    reflection: 'Hoje é uma oportunidade de crescer com clareza.',
    gratitude: 'Obrigado, Deus, por mais um dia.',
  },
]

function calculateHabitState(habits: HabitRecord[], events: HabitEvent[]): HabitEngineState {
  const today = todayIso()
  const todayEvents = events.filter((event) => event.date === today)
  const completedIds = new Set(todayEvents.filter((event) => event.status === 'completed').map((event) => event.habit_id))
  const skippedIds = new Set(todayEvents.filter((event) => event.status === 'skipped').map((event) => event.habit_id))

  return {
    habits,
    events,
    summary: {
      total: habits.length,
      active: habits.filter((habit) => habit.status === 'active').length,
      completedToday: completedIds.size,
      skippedToday: skippedIds.size,
      totalWeightCompleted: habits.filter((habit) => completedIds.has(habit.id)).reduce((sum, habit) => sum + habit.weight, 0),
      strongestStreak: Math.max(0, ...habits.map((habit) => habit.streak)),
    },
  }
}

export async function listHabits(): Promise<HabitEngineState> {
  const userId = await getActiveUserId()
  const localHabits = await readCollection<HabitRecord>('habits', userId)
  const localEvents = await readCollection<HabitEvent>('habit_events', userId)

  if (!supabase || userId === DEMO_USER_ID) {
    return calculateHabitState(localHabits.length ? localHabits : demoHabits, localEvents)
  }

  const [{ data: habits }, { data: events }] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('habit_events').select('*').eq('user_id', userId),
  ])
  const nextHabits = (habits as HabitRecord[] | null) ?? localHabits
  const nextEvents = (events as HabitEvent[] | null) ?? localEvents
  await writeCollection('habits', userId, nextHabits)
  await writeCollection('habit_events', userId, nextEvents)
  return calculateHabitState(nextHabits.length ? nextHabits : demoHabits, nextEvents)
}

export async function createHabit(draft: Omit<HabitDraft, 'user_id'>) {
  const userId = await getActiveUserId()
  const record: HabitRecord = {
    ...draft,
    id: createId('habit'),
    user_id: userId,
    streak: 0,
    best_streak: 0,
    status: 'active',
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  const local = [record, ...(await readCollection<HabitRecord>('habits', userId))]
  await writeCollection('habits', userId, local)
  await supabase?.from('habits').insert(record)
  return listHabits()
}

export async function completeHabit(habit: HabitRecord) {
  const userId = await getActiveUserId()
  const event: HabitEvent = {
    id: createId('habit_event'),
    user_id: userId,
    habit_id: habit.id,
    date: todayIso(),
    status: 'completed',
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  const habits = (await readCollection<HabitRecord>('habits', userId)).map((item) =>
    item.id === habit.id ? { ...item, streak: item.streak + 1, best_streak: Math.max(item.best_streak, item.streak + 1), updated_at: nowIso() } : item,
  )
  await writeCollection('habits', userId, habits.length ? habits : demoHabits.map((item) => (item.id === habit.id ? { ...item, streak: item.streak + 1 } : item)))
  await writeCollection('habit_events', userId, [event, ...(await readCollection<HabitEvent>('habit_events', userId))])
  await supabase?.from('habit_events').insert(event)
  return listHabits()
}

export async function listGoals(): Promise<GoalRecord[]> {
  const userId = await getActiveUserId()
  const local = await readCollection<GoalRecord>('goals', userId)
  if (!supabase || userId === DEMO_USER_ID) {
    return local.length ? local : demoGoals
  }

  const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error || !data) {
    return local.length ? local : demoGoals
  }

  await writeCollection('goals', userId, data as GoalRecord[])
  return (data as GoalRecord[]).length ? (data as GoalRecord[]) : demoGoals
}

export async function createGoal(draft: GoalDraft) {
  const userId = await getActiveUserId()
  const record: GoalRecord = {
    ...draft,
    id: createId('goal'),
    user_id: userId,
    current_value: 0,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  const local = [record, ...(await readCollection<GoalRecord>('goals', userId))]
  await writeCollection('goals', userId, local)
  await supabase?.from('goals').insert(record)
  return listGoals()
}

export async function updateGoalProgress(goal: GoalRecord, currentValue: number) {
  const userId = await getActiveUserId()
  const local = (await readCollection<GoalRecord>('goals', userId)).map((item) =>
    item.id === goal.id ? { ...item, current_value: currentValue, updated_at: nowIso() } : item,
  )
  await writeCollection('goals', userId, local.length ? local : demoGoals.map((item) => (item.id === goal.id ? { ...item, current_value: currentValue } : item)))
  await supabase?.from('goals').update({ current_value: currentValue, updated_at: nowIso() }).eq('id', goal.id).eq('user_id', userId)
  return listGoals()
}

export async function listJournalEntries(): Promise<JournalEntry[]> {
  const userId = await getActiveUserId()
  const local = await readCollection<JournalEntry>('journal', userId)
  if (!supabase || userId === DEMO_USER_ID) {
    return local.length ? local : demoJournalEntries
  }

  const { data, error } = await supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error || !data) {
    return local.length ? local : demoJournalEntries
  }

  await writeCollection('journal', userId, data as JournalEntry[])
  return (data as JournalEntry[]).length ? (data as JournalEntry[]) : demoJournalEntries
}

export async function createJournalEntry(draft: JournalDraft) {
  const userId = await getActiveUserId()
  const record: JournalEntry = {
    ...draft,
    id: createId('journal'),
    user_id: userId,
    entry_date: todayIso(),
    learning: draft.learning?.trim() || null,
    gratitude: draft.gratitude?.trim() || null,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  const local = [record, ...(await readCollection<JournalEntry>('journal', userId))]
  await writeCollection('journal', userId, local)
  await supabase?.from('journal_entries').insert(record)
  return listJournalEntries()
}
