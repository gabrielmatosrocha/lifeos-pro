# Life Coach V1 - PRD, Arquitetura e Inteligência

## 1. Visão

O Life Coach é o mentor inteligente do LifeOS. Ele não é um chatbot e não deve ser tratado como uma janela de conversa genérica. Sua função é observar o contexto do usuário, interpretar sinais de vida e entregar orientação clara, humana e acionável.

O Coach deve ajudar o usuário a evoluir continuamente sem transformar o LifeOS em um produto barulhento. Ele deve saber quando orientar, incentivar, elogiar, cobrar, alertar e também quando permanecer em silêncio.

O objetivo final é que o usuário abra o LifeOS e sinta que existe uma inteligência calma conectando seus sonhos, metas, hábitos, diário, evolução, treinos, espiritualidade e rotina.

## 2. Objetivos

- Criar a arquitetura conceitual do Life Coach antes de qualquer IA real.
- Definir como o Coach consumirá dados de Dream Engine, Memory Engine, Life Engine, Diário, Metas e Evolução.
- Separar responsabilidades em coaches especializados.
- Definir regras de decisão para evitar excesso de mensagens.
- Definir o conceito de Conselho do Dia.
- Definir Life Reviews automáticos: diário, semanal, mensal, trimestral e anual.
- Preparar a arquitetura para integração futura com OpenAI, Claude, Gemini ou modelos locais sem acoplamento à interface.
- Garantir limites de segurança: sem diagnóstico médico, prescrição clínica, substituição de profissionais ou orientação espiritual invasiva.

## 3. Arquitetura

O Life Coach deve ser uma camada de inteligência acima das engines existentes. Ele não deve substituir Life Engine, Dream Engine, Memory Engine ou Evolution. Ele deve consumir seus sinais e transformar isso em orientação.

```text
Fontes de contexto
  Life Engine
  Dream Engine
  Memory Engine
  Evolution
  Metas
  Diário
  Hábitos
  Check-ins
  Perfil e preferências

Normalização
  CoachContext
  CoachSignal
  CoachPreference
  CoachSafetyBoundary

Módulos especializados
  Coach Executivo
  Coach Saúde
  Coach Espiritual
  Coach Mental
  Coach Estratégico

Orquestração
  Coach Orchestrator
  Priority Resolver
  Silence Rules
  Tone Controller
  Safety Guardrails

Saídas
  Conselho do Dia
  Insights
  Recomendações
  Alertas
  Elogios
  Life Reviews
```

### Fronteiras arquiteturais

- Páginas não devem conter regra central do Coach.
- Componentes do Coach devem receber dados prontos, sem conhecer Supabase ou IA.
- Services do Coach devem depender de contratos, não de componentes React.
- O Coach não deve chamar provedores de IA diretamente pela UI.
- Integrações futuras devem passar por adaptadores desacoplados.
- A saída do Coach deve ser explicável, auditável e baseada em sinais.

### Estrutura futura sugerida

```text
apps/web/features/coach
  types
    coach.types.ts
  services
    coach-context.service.ts
    coach-orchestrator.service.ts
    coach-rules.service.ts
    coach-review.service.ts
  adapters
    ai-provider.adapter.ts
    deterministic-coach.adapter.ts

apps/web/components/coach
  CoachDashboard
  CoachCard
  CoachInsight
  CoachAdvice
  CoachReview
  DailyAdvice
  LifeReview
  CoachPreferences
```

Nesta sprint, esta estrutura é apenas planejada. Nenhum arquivo de código precisa ser criado.

## 4. Módulos do Coach

### Coach Executivo

Responsável por produtividade, metas, planejamento, prioridades e execução.

Fontes principais:

- Metas.
- Dream Engine.
- Ações diárias.
- Dashboard Hoje.
- Diário.
- Memory Engine.

Perguntas que responde:

- O que mais importa hoje?
- Qual meta está sem ação recente?
- Qual próximo passo tem maior impacto?
- Onde o usuário está se dispersando?

Exemplos de saída:

- "Hoje concentre seus esforços no estudo. Um bloco de 30 minutos já destrava sua meta da semana."
- "Sua meta de economizar R$ 10.000 precisa de uma ação simples hoje: registrar os gastos essenciais."

### Coach Saúde

Responsável por academia, corrida, sono, hidratação, alimentação saudável e recuperação.

Fontes principais:

- Evolution.
- Check-in Academia.
- Check-in Corrida/Caminhada.
- Hábitos de água, sono e treino.
- Life Engine.
- Memory Engine.

Regras importantes:

- Não prescrever tratamento.
- Não diagnosticar doenças.
- Não substituir médico, nutricionista ou educador físico.
- Sugerir apenas orientações gerais, educativas e seguras.

Exemplos de saída:

- "Você treinou bem esta semana. Hoje vale priorizar recuperação, hidratação e sono."
- "Sua corrida está evoluindo. Mantenha constância antes de aumentar intensidade."

### Coach Espiritual

Responsável por oração, Bíblia, gratidão e vida espiritual.

Fontes principais:

- Preferências espirituais do usuário.
- Diário.
- Check-ins espirituais.
- DailyVerse.
- Memory Engine.

Regras importantes:

- Conteúdo espiritual deve ser configurável.
- Usuário pode ativar, desativar e escolher frequência.
- O Coach nunca deve impor práticas espirituais.
- A linguagem deve ser respeitosa, encorajadora e opcional.

Exemplos de saída:

- "Separe alguns minutos para gratidão hoje. A direção também nasce da pausa."
- "Obrigado, Deus, por mais um dia. Que sua próxima ação seja feita com presença."

### Coach Mental

Responsável por diário, emoções, padrões, humor, estresse, clareza e autoconsciência.

Fontes principais:

- Diário.
- Humor.
- Reflexões.
- Rotina.
- Memory Engine.
- Life Engine.

Regras importantes:

- Nunca realizar diagnóstico médico ou psicológico.
- Nunca afirmar que o usuário tem uma condição clínica.
- Sugerir reflexão, descanso, conversa com alguém de confiança ou busca por profissional quando apropriado.

Exemplos de saída:

- "Seu diário mostra mais clareza quando você registra o dia à noite. Que tal manter esse ritual hoje?"
- "Se a semana parecer pesada, reduza a carga e preserve o essencial."

### Coach Estratégico

Responsável por visão geral da vida, equilíbrio entre áreas, prioridades e evolução de longo prazo.

Fontes principais:

- Life Engine.
- Evolution.
- Dream Engine.
- Memory Engine.
- Futuro Life Vision.
- Metas.

Perguntas que responde:

- Qual área da vida está puxando o progresso?
- Qual área precisa de atenção sem gerar culpa?
- O usuário está equilibrado ou hiperfocado?
- A rotina atual está alinhada com a direção declarada?

Exemplos de saída:

- "Sua saúde está puxando a evolução. Agora o próximo ganho está em estabilizar estudo e leitura."
- "Você está construindo ritmo. Não aumente complexidade antes de consolidar o básico."

## 5. Fluxos

### Fluxo do Conselho do Dia

```text
Coletar contexto do dia
  ações, metas, diário, evolução, memória, preferências
Gerar sinais
  urgência, oportunidade, risco, constância, lacuna, vitória
Resolver prioridade
  escolher um único foco principal
Aplicar regras de segurança e tom
  evitar excesso, culpa e promessa exagerada
Entregar Conselho do Dia
  uma mensagem curta, clara e acionável
```

Regras:

- Deve existir apenas um Conselho do Dia principal.
- Deve ser curto.
- Deve apontar uma ação ou foco.
- Deve considerar preferências e contexto recente.
- Deve evitar mensagens genéricas quando houver sinal específico.
- Deve poder ser gerado de forma determinística antes de IA real.

Exemplos:

- "Hoje concentre seus esforços nos estudos."
- "Seu maior desafio desta semana é manter a disciplina sem aumentar a carga."
- "Você vem evoluindo na academia. Agora é hora de fortalecer sua rotina de leitura."

### Fluxo de Life Review

```text
Selecionar período
  diário, semanal, mensal, trimestral, anual
Agrupar dados
  hábitos, metas, evolução, disciplina, treinos, espiritualidade, estudos
Interpretar sinais
  progresso, queda, risco, vitória, repetição, desequilíbrio
Gerar resumo
  o que aconteceu, o que significa, qual próximo ajuste
Salvar ou apresentar
  futuro histórico de reviews
```

Frequências:

- Diário: resumo simples do dia.
- Semanal: padrão de constância e prioridades.
- Mensal: evolução por área da vida.
- Trimestral: direção estratégica.
- Anual: identidade, grandes aprendizados e visão.

## 6. UX

O Life Coach deve aparecer como uma camada discreta e premium, não como uma tela barulhenta.

Princípios:

- Uma orientação principal por vez.
- Texto humano, curto e elegante.
- Hierarquia visual clara.
- Nada de excesso de cards.
- Nada de tom infantil ou punitivo.
- Motion sutil para entrada de insights.
- Aparência glassmorphism alinhada ao LifeOS.
- Preferências sempre visíveis para reduzir, pausar ou ajustar o Coach.

Pontos de entrada futuros:

- `/app/hoje`: Conselho do Dia e foco operacional.
- `/app/evolucao`: Life Review e análise de tendências.
- `/app/metas`: recomendações de próximos passos.
- `/app/diario`: perguntas de reflexão e leitura emocional.
- `/app/perfil`: preferências, tom e limites do Coach.

## 7. Regras

### Quando elogiar

Elogiar quando houver:

- Sequência mantida.
- Meta avançando.
- Registro importante concluído.
- Treino, estudo ou hábito retomado após pausa.
- Melhora de consistência em relação ao período anterior.

O elogio deve reforçar identidade e esforço, não apenas número.

Exemplo:

- "Você está construindo constância. Esse é o tipo de avanço que muda a identidade."

### Quando incentivar

Incentivar quando houver:

- Pequena queda recuperável.
- Dia com poucas ações concluídas.
- Meta ainda possível.
- Usuário sem diário recente.
- Sinal de oportunidade clara.

Exemplo:

- "Ainda dá para transformar o dia. Escolha uma ação pequena e conclua agora."

### Quando cobrar

Cobrar com elegância quando houver:

- Meta em risco por falta de ação recorrente.
- Padrão de adiamento.
- Compromisso importante ignorado.
- Muita intenção e pouca execução.

Regras de tom:

- Sem culpa.
- Sem humilhação.
- Sem linguagem agressiva.
- Sempre oferecer próximo passo.

Exemplo:

- "Essa meta está ficando distante porque não recebeu ação nesta semana. Hoje, faça o menor passo possível."

### Quando alertar

Alertar quando houver:

- Excesso de carga.
- Queda forte de rotina.
- Desequilíbrio entre áreas.
- Treino intenso sem descanso.
- Pouco sono ou baixa energia reportada.

Exemplo:

- "Seu ritmo está alto. Antes de adicionar novas metas, proteja sono e recuperação."

### Quando permanecer em silêncio

Permanecer em silêncio quando:

- Não houver sinal confiável.
- O usuário já recebeu mensagens suficientes no dia.
- O contexto for ambíguo.
- A recomendação seria genérica.
- Preferências indicarem baixa frequência.
- O usuário estiver em período de pausa.

Silêncio é uma decisão de produto. O LifeOS deve parecer inteligente também quando não fala.

## 8. Personalidade

O Life Coach deve soar como:

- Calmo.
- Inteligente.
- Presente.
- Exigente sem ser duro.
- Espiritual quando o usuário permitir.
- Prático.
- Elegante.
- Humano.

Não deve soar como:

- Chatbot genérico.
- Terapeuta clínico.
- Médico.
- Nutricionista.
- Pastor obrigatório.
- Guru motivacional.
- Fiscal punitivo.
- Aplicativo infantilizado.

Guia de linguagem:

- Frases curtas.
- Uma ideia por mensagem.
- Orientação concreta.
- Tom premium e sóbrio.
- Evitar promessas absolutas.
- Evitar excesso de exclamação.

## 9. Tipos de análises

### Análise de execução

Avalia ações concluídas, pendências, ritmo e aderência ao plano.

### Análise de metas

Avalia progresso, risco, prazo, próxima ação e relação com hábitos.

### Análise de saúde

Avalia treinos, corridas, descanso, hidratação e consistência física. Sempre com linguagem educativa.

### Análise mental

Avalia padrões do diário, humor, energia, clareza e estresse reportado. Sem diagnóstico.

### Análise espiritual

Avalia práticas espirituais configuradas pelo usuário: gratidão, oração, leitura bíblica e reflexão.

### Análise de equilíbrio

Avalia pilares fortes, pilares fracos, excesso de foco em uma área e negligência recorrente.

### Análise de tendência

Compara períodos e identifica crescimento, queda, estabilidade e pontos de atenção.

### Análise de contexto

Usa Memory Engine para lembrar preferências, rotina, dificuldades, objetivos e sinais recorrentes.

## 10. Tipos de recomendações

- Próxima ação.
- Ajuste de rotina.
- Pausa estratégica.
- Revisão de meta.
- Redução de complexidade.
- Hábito de suporte.
- Reflexão guiada.
- Recuperação física.
- Foco do dia.
- Foco da semana.
- Celebração de progresso.
- Alerta de risco.

Cada recomendação deve conter:

- motivo;
- ação sugerida;
- nível de urgência;
- fonte dos sinais;
- tom;
- opção de silêncio ou adiamento no futuro.

## 11. Limites do Coach

O Life Coach não pode:

- Diagnosticar doenças.
- Prescrever medicamentos.
- Criar dieta clínica personalizada.
- Substituir médico, psicólogo, nutricionista, educador físico ou líder espiritual.
- Fazer promessas de resultado.
- Usar linguagem de culpa, medo ou vergonha.
- Recomendar treinos perigosos.
- Criar dependência emocional.
- Forçar conteúdo espiritual.
- Enviar notificações sem preferência configurada.
- Expor dados sensíveis sem consentimento.

Quando o tema for sensível, o Coach deve:

- reduzir certeza;
- usar linguagem educativa;
- sugerir procurar profissional qualificado quando necessário;
- priorizar segurança e autonomia do usuário.

## 12. Integração com os demais módulos

### Life Engine

Fornece scores, pilares, rhythm index, classification, pilar fraco, pilar forte e sinais explicáveis.

O Coach usa esses sinais para decidir foco, tom e prioridade.

### Dream Engine

Fornece metas executáveis de até 12 meses, planos, progresso, status e próxima ação.

O Coach usa esses dados para orientar execução e evitar que sonhos virem apenas intenção.

### Futuro Life Vision

Será responsável por grandes sonhos, missão, legado e visão de futuro. O Coach deve consumir esse contexto apenas para alinhar direção, não para tratar grandes sonhos como tarefas operacionais.

### Memory Engine

Fornece contexto persistente: rotina, preferências, dificuldade, hábitos fortes, hábitos em risco, objetivos e confiança dos sinais.

O Coach deve sempre considerar a confiança da memória antes de agir.

### Evolution

Fornece histórico, comparativos, check-ins, treinos, corridas, streak e analytics.

O Coach usa Evolution para Life Reviews e tendências físicas/comportamentais.

### Diário

Fornece reflexões, humor, gratidão, aprendizados, decisões e padrões subjetivos.

O Coach usa o Diário para personalização, mas deve evitar conclusões clínicas.

### Metas

Fornece objetivos ativos, status, progresso e prazo.

O Coach usa Metas para priorizar o que deve receber ação agora.

### Perfil e preferências

Fornece tom, frequência, espiritualidade, áreas prioritárias e limites pessoais.

Nenhuma orientação sensível deve ignorar preferências explícitas.

## 13. Contratos conceituais

```ts
type CoachContext = {
  date: string
  userId: string
  lifeEngine: LifeEngineOutput
  goals: GoalRecord[]
  dreams: DreamRecord[]
  memories: MemoryRecord[]
  journalEntries: JournalEntry[]
  evolution: EvolutionHistory
  preferences: CoachPreferences
}

type CoachSignal = {
  id: string
  source: 'life-engine' | 'dream-engine' | 'memory-engine' | 'evolution' | 'journal' | 'goals'
  category: 'execution' | 'health' | 'spiritual' | 'mental' | 'strategy'
  confidence: 'low' | 'medium' | 'high'
  urgency: 'low' | 'medium' | 'high'
  summary: string
}

type CoachOutput = {
  dailyAdvice?: CoachAdvice
  insights: CoachInsight[]
  recommendations: CoachRecommendation[]
  review?: LifeReview
  silentReason?: string
}
```

Esses contratos são conceituais nesta sprint. A implementação futura deve adaptar os tipos reais existentes.

## 14. Componentes planejados

### CoachDashboard

Painel principal do Coach. Deve organizar Conselho do Dia, insights e revisão do período.

### CoachCard

Card reutilizável para sinais e recomendações.

### CoachInsight

Mensagem contextual baseada em um sinal específico.

### CoachAdvice

Componente para uma orientação principal, com ação sugerida e explicação curta.

### CoachReview

Resumo de período com pontos fortes, riscos e próximo ajuste.

### DailyAdvice

Versão compacta do Conselho do Dia para `/app/hoje`.

### LifeReview

Visualização de review diário, semanal, mensal, trimestral ou anual.

### CoachPreferences

Controle de frequência, tom, categorias habilitadas e espiritualidade.

## 15. Roadmap de evolução

### V1 - Arquitetura e PRD

- Definir visão, módulos, fluxos, regras, limites e integrações.
- Não implementar IA real.
- Não implementar chat.
- Não implementar banco.

### V2 - Coach determinístico mockado

- Criar tipos e serviços mockados.
- Gerar Conselho do Dia com regras simples.
- Mostrar Coach de forma discreta em `/app/hoje` ou `/app/evolucao`.
- Usar dados já existentes sem nova persistência.

### V3 - Life Review determinístico

- Gerar review diário e semanal com dados mockados ou locais.
- Preparar histórico de reviews.
- Definir UX de comparação por período.

### V4 - Preferências do Coach

- Adicionar controle de frequência, tom e categorias.
- Permitir ativar/desativar espiritualidade.
- Permitir reduzir mensagens.

### V5 - Adaptadores de IA

- Criar camada `ai-provider.adapter`.
- Suportar OpenAI, Claude, Gemini e modelos locais por contrato comum.
- Manter fallback determinístico.
- Registrar guardrails e logs de decisão.

### V6 - Persistência e personalização

- Integrar Supabase.
- Salvar preferências, reviews e feedback do usuário.
- Respeitar RLS.
- Preparar auditoria e privacidade.

## 16. Critérios de aceite para implementação futura

- Coach nunca aparece como chatbot genérico.
- Conselho do Dia é único, claro e acionável.
- Usuário consegue reduzir ou desativar categorias sensíveis.
- Conteúdo espiritual é configurável.
- Não há diagnóstico médico ou psicológico.
- Recomendações são baseadas em sinais explicáveis.
- O Coach sabe permanecer em silêncio.
- Componentes seguem o Design System premium do LifeOS.
- Lógica fica em services/engines, não em páginas.
- IA futura é adaptador, não dependência central.

## 17. Decisões desta sprint

- Life Coach será uma camada de inteligência orquestradora.
- Life Coach não será chat nesta fase.
- Life Coach será dividido em módulos especializados.
- Conselho do Dia será o primeiro artefato de UX do Coach.
- Life Review será o segundo artefato principal.
- IA real fica fora do escopo até a arquitetura determinística estar validada.
- Conteúdo espiritual será sempre configurável.
- Silêncio será tratado como decisão inteligente de produto.

## 18. Implementação V2 - Conselho do Dia determinístico

A primeira implementação visível do Life Coach adiciona um `DailyAdvice` em `/app/hoje`, logo abaixo do HeroScore. O objetivo é apresentar uma orientação principal do dia sem competir com o cockpit principal.

Arquitetura criada:

```text
features/coach
  types
    coach.types.ts
  services
    coach.service.ts

components/coach
  DailyAdvice
```

O service `getDailyCoachAdvice` é determinístico e usa dados mockados já existentes do LifeOS:

- Life Score e Rhythm Index da Life Engine.
- Ações e hábitos do dia.
- Dreams do Dream Engine.
- Memórias do Memory Engine.
- Histórico de evolução do Evolution Core.

Cenários iniciais:

- foco em estudo;
- foco em saúde;
- foco espiritual;
- alerta de queda;
- elogio por consistência.

Guardrails preservados:

- sem IA real;
- sem chat;
- sem banco novo;
- sem prescrição médica, dieta clínica ou treino profissional;
- espiritualidade configurável como princípio de produto;
- tom firme, útil e respeitoso.

Esta V2 valida a experiência do Coach como orientação premium e discreta antes de avançar para reviews, preferências ou adaptadores de IA.
