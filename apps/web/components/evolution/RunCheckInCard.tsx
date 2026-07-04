import { Footprints } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { fieldClassName, selectFieldClassName, textareaFieldClassName } from '@/components/ui/fieldStyles'
import type { RunCheckInRecord } from '@/features/evolution/types/evolution.types'
import PhotoAttachField from './PhotoAttachField'

export default function RunCheckInCard({ runs }: { runs: RunCheckInRecord[] }) {
  const latest = runs[0]

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-100/80">Check-in Corrida/Caminhada</p>
          <h2 className="mt-1 text-xl font-bold text-white">Registrar atividade</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Mock preparado para tipo, distância, tempo, pace, observação e foto.</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-100">
          <Footprints className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Tipo de atividade</span>
          <select className={selectFieldClassName} defaultValue={latest.activityType}>
            <option value="corrida" className="bg-zinc-900">Corrida</option>
            <option value="caminhada" className="bg-zinc-900">Caminhada</option>
          </select>
        </label>
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Distância</span>
          <input className={fieldClassName} defaultValue={`${latest.distanceKm} km`} readOnly />
        </label>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Tempo</span>
          <input className={fieldClassName} defaultValue={latest.duration} readOnly />
        </label>
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Pace</span>
          <input className={fieldClassName} defaultValue={latest.pace} readOnly />
        </label>
      </div>

      <label className="mt-3 block text-sm text-zinc-300">
        <span className="mb-2 block">Observação</span>
        <textarea className={textareaFieldClassName} defaultValue={latest.notes} readOnly rows={3} />
      </label>

      <div className="mt-3">
        <PhotoAttachField label="Foto da atividade" />
      </div>

      <Button type="button" className="mt-4 w-full" variant="secondary">
        Salvar atividade mockada
      </Button>
    </Card>
  )
}
