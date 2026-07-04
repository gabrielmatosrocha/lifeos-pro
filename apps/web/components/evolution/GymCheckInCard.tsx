import { Dumbbell } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { fieldClassName, selectFieldClassName, textareaFieldClassName } from '@/components/ui/fieldStyles'
import type { GymCheckInRecord } from '@/features/evolution/types/evolution.types'
import PhotoAttachField from './PhotoAttachField'

const workoutTypes = [
  'peito e tríceps',
  'costas e bíceps',
  'pernas',
  'ombro',
  'cardio',
  'full body',
  'personalizado',
]

export default function GymCheckInCard({ checkIns }: { checkIns: GymCheckInRecord[] }) {
  const latest = checkIns[0]

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Check-in Academia</p>
          <h2 className="mt-1 text-xl font-bold text-white">Registrar treino</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Interface mockada para data, horário, treino, observação e foto.</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
          <Dumbbell className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Data</span>
          <input className={fieldClassName} defaultValue={latest.date} readOnly />
        </label>
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Horário</span>
          <input className={fieldClassName} defaultValue={latest.time} readOnly />
        </label>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1.2fr]">
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Treino realizado</span>
          <select className={selectFieldClassName} defaultValue={latest.workout}>
            {workoutTypes.map((workout) => (
              <option key={workout} value={workout} className="bg-zinc-900">
                {workout}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Observação</span>
          <textarea className={textareaFieldClassName} defaultValue={latest.notes} readOnly rows={3} />
        </label>
      </div>

      <div className="mt-3">
        <PhotoAttachField label="Foto do treino" />
      </div>

      <Button type="button" className="mt-4 w-full" variant="secondary">
        Salvar check-in mockado
      </Button>
    </Card>
  )
}
