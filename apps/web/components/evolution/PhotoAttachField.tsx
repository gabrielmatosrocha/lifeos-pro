import { ImagePlus, ShieldCheck } from 'lucide-react'

type PhotoAttachFieldProps = {
  label: string
  description?: string
}

export default function PhotoAttachField({
  label,
  description = 'Mock visual. Upload real será conectado ao Supabase Storage em sprint futura.',
}: PhotoAttachFieldProps) {
  return (
    <div className="rounded-[22px] border border-dashed border-white/20 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
          <ImagePlus className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white">{label}</p>
          <p className="mt-1 text-sm leading-5 text-zinc-400">{description}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            Storage ready
          </div>
        </div>
      </div>
    </div>
  )
}
