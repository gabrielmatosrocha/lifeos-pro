import { AlertTriangle, CheckCircle2, CirclePause, Flame, Target } from 'lucide-react'
import Card from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import type { DreamRecord, DreamStatus } from '@/features/dreams/types/dream.types'

type DreamListProps = {
  dreams: DreamRecord[]
  activeDreamId: string
  onSelectDream: (dreamId: string) => void
}

const statusLabel: Record<DreamStatus, string> = {
  active: 'Ativo',
  paused: 'Pausado',
  completed: 'Concluído',
  at_risk: 'Em risco',
}

const statusIcon = {
  active: Flame,
  paused: CirclePause,
  completed: CheckCircle2,
  at_risk: AlertTriangle,
}

const statusClassName: Record<DreamStatus, string> = {
  active: 'border-emerald-300/20 bg-emerald-500/10 text-emerald-100',
  paused: 'border-white/15 bg-white/[0.06] text-zinc-300',
  completed: 'border-cyan-300/20 bg-cyan-500/10 text-cyan-100',
  at_risk: 'border-amber-300/25 bg-amber-500/10 text-amber-100',
}

export default function DreamList({ dreams, activeDreamId, onSelectDream }: DreamListProps) {
  return (
    <Card className="overflow-visible p-4 sm:p-5 xl:h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Sonhos</p>
          <h2 className="mt-1 text-xl font-bold text-white">Direções vivas</h2>
          <p className="mt-1.5 text-sm leading-5 text-zinc-400 sm:mt-2 sm:leading-6">Cada sonho pode virar meta, etapa, hábito e próxima ação.</p>
        </div>
        <Target className="h-5 w-5 text-cyan-100" />
      </div>

      <div className="scrollbar-none mt-4 space-y-3 overflow-visible pr-0 sm:mt-5 xl:max-h-[640px] xl:overflow-y-auto xl:pr-1">
        {dreams.map((dream) => {
          const StatusIcon = statusIcon[dream.status]
          const isActive = dream.id === activeDreamId

          return (
            <button
              key={dream.id}
              type="button"
              onClick={() => onSelectDream(dream.id)}
              className={`w-full rounded-[22px] border p-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 sm:rounded-[24px] sm:p-4 ${
                isActive
                  ? 'border-cyan-300/40 bg-cyan-400/10 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_0_45px_rgba(34,211,238,.12)]'
                  : 'border-white/[0.13] bg-white/[0.045] hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.075]'
              }`}
            >
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-white">{dream.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-400">{dream.why}</p>
                </div>
                <span className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassName[dream.status]}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {statusLabel[dream.status]}
                </span>
              </div>

              <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-zinc-400">
                    <span>{dream.lifeArea} · {dream.deadline}</span>
                    <span>{dream.progress}%</span>
                  </div>
                  <Progress value={dream.progress} />
                </div>
                <p className="line-clamp-1 text-sm text-zinc-400 sm:line-clamp-2 sm:max-w-[240px]">
                  <span className="text-zinc-500">Próxima ação: </span>{dream.nextAction}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
