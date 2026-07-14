import type { CoachAdvice, CoachDomain, CoachSignal, CoachTone } from '../types/coach'
import type { PillarScores } from './life-engine'

export type AdviceScenario = {
  id: string
  domain: CoachDomain
  tone: CoachTone
  title: string
  message: string
  action: string
  reason: string
  signal: Omit<CoachSignal, 'id'>
}

export const coachAdviceScenarios: AdviceScenario[] = [
  {
    id: 'study-focus',
    domain: 'executivo',
    tone: 'firme',
    title: 'Conselho de hoje',
    message: 'Seu ritmo está bom, mas sua consistência nos estudos merece atenção hoje.',
    action: 'Reserve 30 minutos para estudar antes do fim do dia.',
    reason: 'Seu pilar Conhecimento está abaixo dos demais nesta semana.',
    signal: {
      source: 'life-engine',
      domain: 'executivo',
      confidence: 'alta',
      urgency: 'media',
      summary: 'Conhecimento aparece como lacuna operacional do dia.',
    },
  },
  {
    id: 'health-focus',
    domain: 'saude',
    tone: 'incentivo',
    title: 'Conselho de hoje',
    message: 'Sua evolução física pede uma base simples: hidratação, movimento e recuperação.',
    action: 'Beba água agora e faça uma caminhada leve ou mobilidade curta.',
    reason: 'Os sinais de saúde estão abaixo do seu ritmo geral.',
    signal: {
      source: 'evolution',
      domain: 'saude',
      confidence: 'media',
      urgency: 'media',
      summary: 'Saúde precisa de uma ação segura e educativa.',
    },
  },
  {
    id: 'spiritual-focus',
    domain: 'espiritual',
    tone: 'calmo',
    title: 'Conselho de hoje',
    message: 'Antes de acelerar, volte ao centro. Direção também nasce da pausa.',
    action: 'Separe 10 minutos para oração, gratidão ou leitura bíblica.',
    reason: 'Sua memória espiritual indica que esse hábito ajuda sua estabilidade.',
    signal: {
      source: 'memory-engine',
      domain: 'espiritual',
      confidence: 'media',
      urgency: 'baixa',
      summary: 'Espiritualidade configurável como suporte de direção.',
    },
  },
  {
    id: 'drop-alert',
    domain: 'estrategico',
    tone: 'alerta',
    title: 'Conselho de hoje',
    message: 'Seu ritmo caiu. Hoje não é dia de complicar, é dia de recuperar o básico.',
    action: 'Escolha uma única ação essencial e conclua antes de abrir novas frentes.',
    reason: 'Há mais pendências do que ações concluídas no dia.',
    signal: {
      source: 'actions',
      domain: 'estrategico',
      confidence: 'alta',
      urgency: 'alta',
      summary: 'Queda operacional pede redução de escopo.',
    },
  },
  {
    id: 'consistency-praise',
    domain: 'estrategico',
    tone: 'elogio',
    title: 'Conselho de hoje',
    message: 'Você está construindo constância. Esse é o tipo de avanço que muda identidade.',
    action: 'Proteja o ritmo: conclua uma ação pequena e encerre o dia com clareza.',
    reason: 'Seu Life Score e seu streak mostram consistência positiva.',
    signal: {
      source: 'evolution',
      domain: 'estrategico',
      confidence: 'alta',
      urgency: 'baixa',
      summary: 'Consistência sustentada merece reforço positivo.',
    },
  },
]

export function getLowestPillar(pillarScores: PillarScores) {
  return Object.entries(pillarScores).sort((a, b) => a[1] - b[1])[0]
}

export function createCoachAdvice(scenario: AdviceScenario): CoachAdvice {
  return {
    ...scenario,
    signal: {
      ...scenario.signal,
      id: `${scenario.id}-signal`,
    },
  }
}
