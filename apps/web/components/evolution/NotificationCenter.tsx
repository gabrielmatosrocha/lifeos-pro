import { Bell } from 'lucide-react'
import Card from '@/components/ui/Card'
import SmartReminder from './SmartReminder'
import type { SmartReminderRecord } from '@/features/evolution/types/evolution.types'

export default function NotificationCenter({ reminders }: { reminders: SmartReminderRecord[] }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-cyan-200" />
        <h2 className="text-xl font-bold text-white">Life Intelligence</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">Notificações inteligentes por saúde, academia, corrida, hábitos, metas, estudos, espiritualidade e motivação.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {reminders.map((reminder) => (
          <SmartReminder key={reminder.id} reminder={reminder} />
        ))}
      </div>
    </Card>
  )
}
