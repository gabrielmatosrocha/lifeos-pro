import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'

const goals = [
  ['Correr 20 km este mês', 'Saúde', 60],
  ['Estudar 20 horas', 'Conhecimento', 40],
  ['Registrar gratidão 15 dias', 'Mente', 75],
]

export default function MetasPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header>
        <p className="text-slate-500">Direção</p>
        <h1 className="text-3xl font-bold">Metas</h1>
      </header>

      <Card>
        <h2 className="text-xl font-bold">Nova meta</h2>
        <div className="mt-4 space-y-3">
          <input className="w-full rounded-xl border p-3" placeholder="Ex: Correr 20 km este mês" />
          <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">Criar meta</button>
        </div>
      </Card>

      <section className="space-y-4">
        {goals.map(([title, pillar, progress]) => (
          <Card key={title as string}>
            <p className="text-sm text-slate-500">{pillar}</p>
            <h3 className="mt-1 text-lg font-bold">{title}</h3>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <Progress value={Number(progress)} />
            </div>
          </Card>
        ))}
      </section>
    </main>
  )
}
