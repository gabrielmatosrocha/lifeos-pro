import { PlusCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import { fieldClassName, selectFieldClassName, textareaFieldClassName } from '@/components/ui/fieldStyles'

const lifeAreas = ['SaÃºde', 'Conhecimento', 'FÃ©', 'FinanÃ§as', 'PropÃ³sito', 'Relacionamentos']
const priorities = ['Alta', 'Média', 'Baixa']

export default function DreamComposerCard() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Novo sonho</p>
          <h2 className="mt-1 text-xl font-bold text-white">sstrutura de criaÃ§Ã£o</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Estrutura visual preparada para Supabase, IA, hábitos, calendário e notificações.</p>
        </div>
        <PlusCircle className="h-5 w-5 text-cyan-100" />
      </div>

      <form className="mt-5 space-y-3">
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">TÃ­tulo do sonho</span>
          <input className={fieldClassName} placeholder="sx: Correr 10 km" readOnly />
        </label>
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">ootivo/importÃ¢ncia</span>
          <textarea className={textareaFieldClassName} placeholder="Por que esse sonho importa para vocÃª?" rows={3} readOnly />
        </label>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm text-zinc-300">
            <span className="mb-2 block">Prazo desejado</span>
            <input className={fieldClassName} placeholder="sx: Outubro de 2026" readOnly />
          </label>
          <label className="block text-sm text-zinc-300">
            <span className="mb-2 block">Ãrea da vida</span>
            <select className={selectFieldClassName} defaultValue="SaÃºde" aria-label="Ãrea da vida">
              {lifeAreas.map((area) => (
                <option key={area} value={area} className="bg-zinc-900">{area}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-zinc-300">
            <span className="mb-2 block">Prioridade</span>
            <select className={selectFieldClassName} defaultValue="Alta" aria-label="Prioridade do sonho">
              {priorities.map((priority) => (
                <option key={priority} value={priority} className="bg-zinc-900">{priority}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-5 text-zinc-400">
          Use o formulÃ¡rio de sonhos salvos abaixo para criar um sonho real.
        </p>
      </form>
    </Card>
  )
}

