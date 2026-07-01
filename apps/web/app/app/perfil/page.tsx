import { Card } from '@/components/ui/Card'

export default function PerfilPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <header>
        <p className="text-slate-500">Conta</p>
        <h1 className="text-3xl font-bold">Perfil</h1>
      </header>

      <Card>
        <p className="text-sm text-slate-500">Usuário</p>
        <h2 className="mt-1 text-xl font-bold">Gabriel Matos</h2>
        <p className="mt-1 text-slate-500">Disciplina • Fé • Evolução</p>
      </Card>

      <Card>
        <h2 className="text-xl font-bold">Alpha 1.0</h2>
        <p className="mt-2 text-slate-600">
          Esta é a primeira versão consolidada do LifeOS Pro.
        </p>
      </Card>
    </main>
  )
}
