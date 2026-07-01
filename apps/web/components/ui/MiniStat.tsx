"use client";

import { motion } from "framer-motion";

type Props = {
  icon: string
  title: string
  value: string
  color?: string
  delay?: number
}

export default function MiniStat({
  icon,
  title,
  value,
  color = "from-sky-500 to-cyan-400",
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(0,0,0,.35)]"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-xl shadow-lg`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-zinc-400">{title}</p>

      <h3 className="mt-1 text-3xl font-bold tracking-tight text-white">
        {value}
      </h3>
    </motion.div>
  )
}