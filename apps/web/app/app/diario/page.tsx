"use client"

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import FeedbackState from '@/components/ui/FeedbackState'
import { fieldClassName, selectFieldClassName, subtleActionClassName, textareaFieldClassName } from '@/components/ui/fieldStyles'
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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function hydrateEntries() {
      setIsLoading(true)
      setError(null)
      try {
        const nextEntries = await listJournalEntries()
        if (isMounted) {
          setEntries(nextEntries)
        }
      } catch {
        if (isMounted) {
          setError('Não foi possível atualizar o diário agora.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
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
      setError('Preencha título e reflexão antes de salvar.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const nextEntries = await createJournalEntryRecord({ title, mood, reflection })
      setEntries(nextEntries)
      setTitle('')
      setMood('Bom')
      setReflection('')
    } catch {
      setError('Não foi possível salvar a reflexão agora.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(entryId: string) {
    setError(null)
    try {
      const nextEntries = await deleteJournalEntry(entryId)
      setEntries(nextEntries)
    } catch {
      setError('Não foi possível excluir a reflexão agora.')
    }
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 pb-40 pt-6 text-white sm:pb-48">
      <header>
        <p className="text-sm font-medium text-cyan-100/70">Reflexão</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Diário</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Um minuto de verdade hoje vira inteligência para a sua vida amanhã.</p>
      </header>

      {error ? <FeedbackState variant="error" title="Atenção" description={error} /> : null}

      <Card>
        <h2 className="text-xl font-bold">Nova reflexão</h2>
        <p className="mt-1 text-sm text-zinc-400">Escreva sem performar. Clareza também é progresso.</p>
        <form onSubmit={handleCreateEntry} className="mt-4 space-y-3">
          <input value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClassName} placeholder="Título" aria-label="Título da reflexão" />
          <select value={mood} onChange={(event) => setMood(event.target.value as JournalMood)} className={selectFieldClassName} aria-label="Humor do dia">
            {moods.map((item) => (
              <option key={item} value={item} className="bg-zinc-900">{item}</option>
            ))}
          </select>
          <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} className={textareaFieldClassName} rows={4} placeholder="Reflexão do dia" aria-label="Reflexão do dia" />
          <Button type="submit" isLoading={isSaving}>Salvar reflexão</Button>
        </form>
      </Card>

      <section className="space-y-4">
        {isLoading ? (
          <FeedbackState variant="loading" title="Carregando diário" description="Organizando suas reflexões recentes." />
        ) : entries.length === 0 ? (
          <FeedbackState variant="empty" title="Nenhuma reflexão registrada" description="Escreva uma frase honesta sobre o dia para gerar inteligência pessoal." />
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{entry.entry_date}</p>
                  <h3 className="mt-1 text-lg font-bold">{entry.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{entry.mood}</p>
                  <p className="mt-3 text-slate-300">{entry.reflection}</p>
                </div>
                <button type="button" onClick={() => void handleDelete(entry.id)} className={subtleActionClassName}>Excluir</button>
              </div>
            </Card>
          ))
        )}
      </section>
    </main>
  )
}
