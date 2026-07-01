import { Card } from '@/components/ui/Card'

export default function DiarioPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header>
        <p className="text-slate-500">Reflexão</p>
        <h1 className="text-3xl font-bold">Diário</h1>
      </header>

      <Card>
        <h2 className="text-xl font-bold">Nova reflexão</h2>
        <div className="mt-4 space-y-3">
          <input className="w-full rounded-xl border p-3" placeholder="Título" />
          <select className="w-full rounded-xl border p-3">
            <option>🙂 Bom</option>
            <option>😊 Excelente</option>
            <option>😐 Neutro</option>
            <option>😔 Difícil</option>
          </select>
          <textarea className="w-full rounded-xl border p-3" rows={4} placeholder="Reflexão do dia" />
          <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">Salvar reflexão</button>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">Hoje</p>
        <h3 className="mt-1 text-lg font-bold">Primeira entrada do Alpha</h3>
        <p className="mt-3 text-slate-700">
          Hoje o LifeOS começa a ganhar forma como produto.
        </p>
      </Card>
    </main>
  )
}
