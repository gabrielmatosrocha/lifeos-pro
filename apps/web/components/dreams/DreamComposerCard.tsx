import { PlusCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { fieldClassName, selectFieldClassName, textareaFieldClassName } from '@/components/ui/fieldStyles'

const lifeAreas = ['Saúde', 'Conhecimento', 'Fé', 'Finanças', 'Propósito', 'Relacionamentos']
const priorities = ['Alta', 'Média', 'Baixa']

export default function DreamComposerCard() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100/80">Novo sonho</p>
          <h2 className="mt-1 text-xl font-bold text-white">Estrutura de criação</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Mock visual preparado para Supabase, IA, hábitos, calendário e notificações.</p>
        </div>
        <PlusCircle className="h-5 w-5 text-cyan-100" />
      </div>

      <form className="mt-5 space-y-3">
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Título do sonho</span>
          <input className={fieldClassName} placeholder="Ex: Correr 10 km" readOnly />
        </label>
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Motivo/importância</span>
          <textarea className={textareaFieldClassName} placeholder="Por que esse sonho importa para você?" rows={3} readOnly />
        </label>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm text-zinc-300">
            <span className="mb-2 block">Prazo desejado</span>
            <input className={fieldClassName} placeholder="Ex: Outubro de 2026" readOnly />
          </label>
          <label className="block text-sm text-zinc-300">
            <span className="mb-2 block">Área da vida</span>
            <select className={selectFieldClassName} defaultValue="Saúde" aria-label="Área da vida">
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
        <Button type="button" variant="secondary" className="w-full">
          Gerar plano mockado
        </Button>
      </form>
    </Card>
  )
}
