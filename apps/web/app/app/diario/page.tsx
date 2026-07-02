"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { createJournalEntryRecord, deleteJournalEntry, listJournalEntries, loadJournalEntries } from '@/features/journal/services/journal.service'
import type { JournalEntry, JournalMood } from '@/features/journal/types/journal.types'

const moods: JournalMood[] = ['Bom', 'Excelente', 'Neutro', 'Difícil']

export default function DiarioPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    return loadJournalEntries()
  })
  const [title, setTitle] = useState('')
  const [mood, setMood] = useState<JournalMood>('Bom')
  const [reflection, setReflection] = useState('')

  useEffect(() => {
    let isMounted = true

    async function hydrateEntries() {
      const nextEntries = await listJournalEntries()
      if (isMounted) {
        setEntries(nextEntries)
      }
    }

    void hydrateEntries()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleCreateEntry(event: React.FormEvent) {
    event.preventDefault()

    if (!title.trim() || !reflection.trim()) {
      return
    }

    const nextEntries = await createJournalEntryRecord({ title, mood, reflection })
    setEntries(nextEntries)
    setTitle('')
    setMood('Bom')
    setReflection('')
  }

  async function handleDelete(entryId: string) {
    const nextEntries = await deleteJournalEntry(entryId)
    setEntries(nextEntries)
  }

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header>
        <p className="text-slate-500">Reflexão</p>
        <h1 className="text-3xl font-bold">Diário</h1>
      </header>

      <Card>
        <h2 className="text-xl font-bold">Nova reflexão</h2>
        <form onSubmit={handleCreateEntry} className="mt-4 space-y-3">
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white" placeholder="Título" />
          <select value={mood} onChange={(event) => setMood(event.target.value as JournalMood)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white">
            {moods.map((item) => (
              <option key={item} value={item} className="bg-zinc-900">{item}</option>
            ))}
          </select>
          <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-white" rows={4} placeholder="Reflexão do dia" />
          <button type="submit" className="rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white">Salvar reflexão</button>
        </form>
      </Card>

      <section className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{entry.entry_date}</p>
                <h3 className="mt-1 text-lg font-bold">{entry.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{entry.mood}</p>
                <p className="mt-3 text-slate-700">{entry.reflection}</p>
              </div>
              <button type="button" onClick={() => void handleDelete(entry.id)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">Excluir</button>
            </div>
          </Card>
        ))}
      </section>
    </main>
  )
}
