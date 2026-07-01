import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <section className="max-w-3xl text-center space-y-6">
        <p className="text-blue-400 font-semibold">LifeOS Pro</p>
        <h1 className="text-5xl font-bold">Disciplina • Fé • Evolução</h1>
        <p className="text-slate-300 text-lg">
          Um sistema operacional pessoal para viver melhor um dia de cada vez.
        </p>
        <Link href="/login" className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">
          Entrar
        </Link>
      </section>
    </main>
  )
}
