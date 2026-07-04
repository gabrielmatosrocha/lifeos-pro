import type { SmartReminderRecord } from '@/features/evolution/types/evolution.types'

export default function SmartReminder({ reminder }: { reminder: SmartReminderRecord }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-white">{reminder.category}</p>
        <span className="text-xs text-zinc-500">{reminder.timing}</span>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{reminder.message}</p>
      <p className="mt-2 text-xs text-cyan-200">IA: {reminder.tone}</p>
    </div>
  )
}
