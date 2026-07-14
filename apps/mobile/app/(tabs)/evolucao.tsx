import { PlatformScreen } from '@/screens/PlatformScreen'

export default function EvolutionScreen() {
  return (
    <PlatformScreen
      eyebrow="Evolucao"
      title="Evolucao Mobile"
      description="Resumo preparado para consumir os registros reais da plataforma. GPS fica para sprint futura."
      stats={[
        { label: 'GPS', value: 'Futuro' },
        { label: 'Check-ins', value: 'Base' },
      ]}
      notes={['GPS não foi implementado nesta sprint.', 'O MVP atual foca Login, Dashboard, Hábitos, Metas, Diário e Perfil.']}
    />
  )
}
