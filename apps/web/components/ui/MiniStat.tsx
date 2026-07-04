"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  icon: ReactNode
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
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.38, ease: "easeOut" }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="group relative overflow-hidden rounded-[22px] border border-white/[0.12] bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.10)] backdrop-blur-xl transition-colors duration-300 hover:border-cyan-200/25 hover:bg-white/[0.075] sm:p-5"
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-lg shadow-[0_14px_35px_rgba(0,0,0,.25)] sm:h-12 sm:w-12 sm:text-xl [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6`}
      >
        {icon}
      </div>

      <p className="mt-4 text-sm leading-5 text-zinc-400 sm:mt-5">{title}</p>

      <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
        {value}
      </h3>
    </motion.div>
  )
}
