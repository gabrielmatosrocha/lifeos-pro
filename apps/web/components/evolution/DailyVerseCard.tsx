import { BookOpen } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { DailyVerse } from '@/features/evolution/types/evolution.types'

export default function DailyVerseCard({ verse }: { verse: DailyVerse }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-200" />
          <h2 className="text-xl font-bold text-white">Espiritualidade</h2>
        </div>
        <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs text-zinc-300">{verse.enabled ? verse.frequency : 'desativado'}</span>
      </div>
      <blockquote className="mt-5 text-lg font-semibold leading-8 text-white">“{verse.text}”</blockquote>
      <p className="mt-2 text-sm text-amber-100">{verse.reference}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <p className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-zinc-300">{verse.gratitudePrompt}</p>
        <p className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-zinc-300">{verse.prayerPrompt}</p>
      </div>
    </Card>
  )
}
