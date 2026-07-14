import { ImagePlus } from 'lucide-react'

export default function PhotoUpload({ label = 'Foto mock' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-3 py-2 text-xs text-zinc-400">
      <ImagePlus className="h-4 w-4 text-cyan-200" />
      <span>{label} · Supabase Storage ready</span>
    </div>
  )
}
