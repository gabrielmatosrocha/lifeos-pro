"use client"

import { motion } from 'framer-motion'

type HeroScoreProps = {
  score: number
  classification: string
  insight: string
}

export default function HeroScore({ score, classification, insight }: HeroScoreProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.45 }}
      className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-zinc-900/80 to-fuchsia-500/15 p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-zinc-400">Resumo de hoje</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">{score}/100</h2>
          <p className="mt-2 text-sm text-zinc-300">{classification}</p>
        </div>
        <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
          {insight}
        </div>
      </div>
    </motion.section>
  )
}
