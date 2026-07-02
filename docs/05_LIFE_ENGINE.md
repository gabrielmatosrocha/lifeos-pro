# Life Engine - LifeOS Pro

## Proposito

Life Engine e o coracao do LifeOS Pro. Ela transforma eventos da vida do usuario em sinais interpretaveis: score, ritmo, equilibrio, diagnostico, tendencia e recomendacoes.

## Estado Atual

Implementacao usada pelo app: `apps/web/features/life-engine/services/life-engine.service.ts`

Implementacao no package: `packages/engine/src/index.ts`

Hoje, a engine do app:

- Recebe `LifeAction[]`.
- Soma impactos por tipo.
- Atualiza scores por pilar.
- Calcula `lifeScore`.
- Calcula `rhythmIndex`.
- Classifica o dia.
- Identifica pilar mais fraco.
- Gera insight textual simples.

## Pilares Atuais

- Fe.
- Saude.
- Mente.
- Conhecimento.
- Financas.
- Proposito.
- Consistencia.

Observacao: os arquivos atuais contem acentuacao corrompida em alguns textos. A normalizacao de encoding deve ser tratada antes de expandir regras sensiveis a string.

## Tipos de Acao Atuais

- `WATER_LOGGED`
- `PRAYER_DONE`
- `BIBLE_READING`
- `GRATITUDE_WRITTEN`
- `WORKOUT_DONE`
- `RUN_COMPLETED`
- `STUDY_SESSION`
- `MOOD_CHECKIN`
- `JOURNAL_ENTRY`
- `FINANCE_ENTRY`
- `DAY_CLOSED`
- `CUSTOM_ACTION`

## Saida Atual

A engine retorna `rhythmIndex`, `lifeScore`, `classification`, `pillarScores`, `insight` e `actions`.

## Modelo Conceitual Desejado

```text
Eventos da vida
  acoes, metas, diario, humor, saude, financas, aprendizado
Normalizacao
  tipo, pilar, valor, confianca, data, origem
Pontuacao
  impacto, frequencia, consistencia, equilibrio, dificuldade
Diagnostico
  ritmo, risco, pilar fraco, pilar forte, tendencia
Recomendacao
  proxima acao, ajuste, alerta, celebracao
```

## Scores Recomendados

### Life Score

Medida estrutural do estado geral da vida do usuario. Deve considerar pilares, tendencias, metas, consistencia historica e qualidade de reflexoes.

### Rhythm Index

Medida operacional do ritmo atual. Deve considerar acoes recentes, conclusao diaria, sequencia, energia, humor e momentum.

### Pillar Score

Medida de cada area da vida. Deve considerar volume, qualidade, frequencia, recencia e relacao com metas.

## Regras Futuras

1. Separar impacto base, peso pessoal e contexto.
2. Adicionar decaimento temporal.
3. Evitar que muitas acoes pequenas inflem score sem equilibrio.
4. Valorizar consistencia, mas nao punir descanso planejado.
5. Criar explicabilidade para cada score.
6. Gerar recomendacoes pequenas e acionaveis.
7. Permitir calibracao por perfil do usuario.

## Contratos Desejados

```ts
type LifeEngineInput = {
  actions: LifeAction[]
  goals: GoalRecord[]
  journalEntries: JournalEntry[]
  date: string
  userProfile?: LifeProfile
}

type LifeEngineOutput = {
  rhythmIndex: number
  lifeScore: number
  classification: string
  pillarScores: Record<Pillar, number>
  insights: LifeInsight[]
  recommendations: LifeRecommendation[]
  explanation: LifeScoreExplanation
}
```

## Roadmap da Engine

1. Consolidar engine em `packages/engine`.
2. Corrigir encoding de pilares e textos.
3. Criar testes de score.
4. Incorporar metas, diario e historico.
5. Gerar recomendacoes deterministicas.
6. Personalizar pesos por usuario.
7. Preparar camada de IA com seguranca e explicabilidade.
