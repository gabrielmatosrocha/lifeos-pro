# PRD Master - LifeOS Pro

## Produto

LifeOS Pro e um aplicativo web, inicialmente, para operar a vida pessoal do usuario por meio de acoes diarias, metas, diario, evolucao, perfil e uma engine de inteligencia pessoal.

## Problema

Pessoas ambiciosas costumam ter sonhos, metas e habitos espalhados em varios lugares: notas, apps de tarefas, diarios, planilhas, trackers e memoria. Isso gera fragmentacao, ansiedade e pouca clareza sobre progresso real.

LifeOS Pro resolve isso criando uma camada unica de execucao e leitura da vida.

## Publico Inicial

- Pessoas em busca de alta performance pessoal.
- Usuarios que querem evoluir em fe, saude, mente, conhecimento, financas, proposito e consistencia.
- Criadores, profissionais e estudantes que precisam transformar metas em rotina.
- Usuarios que valorizam produtos bonitos, premium e bem acabados.

## Proposta de Valor

Um sistema operacional pessoal que ajuda o usuario a definir direcao, executar acoes importantes hoje, registrar progresso, refletir sobre aprendizados, medir ritmo e equilibrio e receber insights para evoluir.

## Escopo Atual

O projeto atual ja possui:

- Aplicativo web em Next.js.
- TypeScript.
- Tailwind CSS.
- Framer Motion.
- Lucide React.
- Autenticacao com Supabase ou fallback local.
- Dashboard em `apps/web/app/app/hoje/page.tsx`.
- Navegacao inferior com Hoje, Evolucao, Metas, Diario e Perfil.
- Componentes de UI premium dark.
- Life Engine inicial.
- Dados demo e persistencia local.
- Estrutura Supabase inicial.

## Modulos do Produto

### Hoje

Centro operacional diario. Deve responder qual e meu ritmo hoje, o que fiz, o que falta, qual pilar precisa de atencao e que acao pequena mais mudaria meu dia.

### Metas

Area de direcao e progresso. Deve conectar objetivos maiores a acoes diarias e pilares.

### Diario

Area de reflexao. Deve capturar humor, aprendizados, gratidao, dores, decisoes e sinais pessoais.

### Evolucao

Area analitica. Deve mostrar tendencias, scores, sequencias, relatorios e mudancas de comportamento.

### Perfil

Area de identidade, preferencias, configuracoes, contexto pessoal e onboarding.

### Life Engine

Camada central que interpreta acoes, pesos, pilares e historico para gerar score, ritmo, classificacao e insights.

## Requisitos Funcionais Prioritarios

1. Usuario deve conseguir criar conta e entrar.
2. Usuario deve conseguir registrar acoes do dia.
3. Usuario deve conseguir marcar acoes como concluidas ou pendentes.
4. Usuario deve conseguir excluir acoes.
5. Usuario deve ver score do dia e classificacao.
6. Usuario deve ver pontuacao por pilar.
7. Usuario deve conseguir criar metas.
8. Usuario deve conseguir atualizar progresso das metas.
9. Usuario deve conseguir registrar reflexoes no diario.
10. App deve funcionar em modo demo/local quando Supabase nao estiver configurado.

## Requisitos Nao Funcionais

- Build deve passar com `npm run build`.
- Interface deve ser responsiva.
- Experiencia principal deve ser mobile-first sem sacrificar desktop.
- Tipos TypeScript devem proteger contratos importantes.
- Componentes reutilizaveis devem ser preferidos.
- Dados de usuario nao devem vazar entre usuarios.
- Estados vazios, carregamento e erro devem ser tratados com dignidade visual.

## Fora de Escopo Imediato

- App nativo.
- Wearables.
- IA generativa plena.
- Marketplace de templates.
- Colaboracao multiusuario.
- Gamificacao complexa.

## Metricas de Sucesso

- Retencao diaria.
- Numero de acoes registradas por dia.
- Percentual de dias com diario preenchido.
- Metas ativas com progresso semanal.
- Tempo ate registrar primeira acao.
- Frequencia de retorno a tela Hoje.
- Qualidade percebida da interface.
