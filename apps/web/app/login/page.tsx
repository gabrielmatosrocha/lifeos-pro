import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <p className="font-semibold text-blue-600">LifeOS Pro</p>
        <h1 className="mt-2 text-2xl font-bold">Entrar</h1>
        <p className="mt-2 text-slate-500">Acesse seu sistema pessoal.</p>

        <form className="mt-6 space-y-4">
          <input className="w-full rounded-xl border p-3" type="email" placeholder="E-mail" />
          <input className="w-full rounded-xl border p-3" type="password" placeholder="Senha" />
          <Link href="/app/hoje" className="block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white">
            Entrar no Alpha
          </Link>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Login visual do Alpha. Autenticação real será refinada na fase Beta.
        </p>
      </section>
    </main>
  )
}
