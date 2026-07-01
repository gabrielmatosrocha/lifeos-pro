import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LifeOS Pro',
  description: 'Disciplina • Fé • Evolução',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
