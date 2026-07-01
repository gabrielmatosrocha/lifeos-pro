import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { demoActions } from '@/features/demo/demo-data'
import { runLifeEngine } from '@/features/life-engine/services/life-engine.service'

export default function EvolucaoPage() {
  const summary = runLifeEngine(demoActions)

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header>
        <p className="text-slate-500">Sua jornada</p>
        <h1 className="text-3xl font-bold">Evolução</h1>
      </header>

      <Card>
        <p className="text-sm text-slate-500">Ritmo geral</p>
        <p className="mt-2 text-5xl font-bold">{summary.rhythmIndex}</p>
        <p className="mt-2 text-slate-500">{summary.insight}</p>
      </Card>

      <Card>
        <h2 className="text-xl font-bold">Pilares</h2>
        <div className="mt-4 space-y-4">
          {Object.entries(summary.pillarScores).map(([pillar, value]) => (
            <div key={pillar}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{pillar}</span>
                <span>{value}</span>
              </div>
              <Progress value={Number(value)} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold">Timeline</h2>
        <div className="mt-4 space-y-3">
          {demoActions.map((action) => (
            <div key={action.id} className="rounded-xl border p-3">
              <p className="font-semibold">{action.title}</p>
              <p className="text-sm text-slate-500">{action.pillar} • Hoje</p>
            </div>
          ))}
        </div>
      </Card>
    </main>
  )
}
