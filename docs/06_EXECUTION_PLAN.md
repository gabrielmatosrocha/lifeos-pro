# Execution Plan - LifeOS Pro

## Regra Principal

Preservar o que ja existe. Evoluir por incrementos pequenos, verificaveis e com build passando.

## Fase 0 - Higiene e Base

Objetivo: deixar a base confiavel para continuar evoluindo.

Entregas:

- Corrigir encoding dos textos com acentuacao corrompida.
- Garantir `npm run build` passando.
- Garantir `npm run typecheck` passando.
- Revisar `Button` para aceitar `className` e variantes.
- Adicionar estados de erro e loading padronizados.
- Documentar variaveis de ambiente esperadas.
- Decidir se npm workspaces segue como padrao oficial.

## Fase 1 - Dashboard Hoje Premium

Objetivo: transformar `/app/hoje` no cockpit diario do LifeOS.

Entregas:

- HeroScore visual com anel ou medidor premium.
- Estado ativo da navegacao.
- Cards de acoes com interacao mais polida.
- Registro rapido de acao com menos friccao.
- Estados vazios bonitos.
- Insight da Life Engine com explicacao curta.
- Melhor responsividade mobile.

## Fase 2 - Life Engine Canonica

Objetivo: mover logica de score para uma engine compartilhada e testada.

Entregas:

- Consolidar `apps/web/features/life-engine` e `packages/engine`.
- Criar tipos compartilhados.
- Criar testes para pilares, scores e classificacoes.
- Adicionar metas e diario como entradas da engine.
- Criar explicacao do score.

## Fase 3 - Persistencia e Supabase

Objetivo: alinhar banco, tipos e produto real.

Entregas:

- Adicionar coluna `status` em `actions`.
- Normalizar `pillar` e `category`.
- Criar migrations incrementais.
- Tipar respostas do Supabase.
- Melhorar fallback local.
- Tratar erros explicitamente na UI.
- Revisar RLS.

## Fase 4 - Metas como Sistema de Direcao

Objetivo: metas deixarem de ser lista e virarem direcao viva.

Entregas:

- Metas por horizonte: semana, mes, trimestre, ano.
- Vincular metas a pilares.
- Vincular acoes diarias a metas.
- Mostrar progresso por meta.
- Criar recomendacoes a partir de metas atrasadas.

## Fase 5 - Diario Inteligente

Objetivo: transformar reflexao em dados vivos.

Entregas:

- Humor, gratidao, aprendizado e decisao.
- Templates de reflexao diaria.
- Revisao semanal.
- Sinais para Life Engine.
- Busca e historico.

## Fase 6 - Evolucao e Analytics

Objetivo: dar ao usuario leitura real da propria vida.

Entregas:

- Graficos semanais e mensais.
- Tendencias por pilar.
- Sequencias.
- Relatorios de progresso.
- Comparacao entre metas e execucao.

## Fase 7 - Polimento Premium

Objetivo: atingir nivel de produto memoravel.

Entregas:

- Microinteracoes.
- Acessibilidade.
- Performance.
- Design tokens.
- Componentes consistentes.
- Onboarding premium.
- Empty states e error states desenhados.

## Fase 8 - Preparacao para Vercel e Beta

Objetivo: deixar pronto para usuarios reais.

Entregas:

- Variaveis de ambiente documentadas.
- Build limpo.
- Deploy preview.
- QA em mobile e desktop.
- Checklist de privacidade.
- Observabilidade basica.

## Ordem Recomendada Imediata

1. Rodar build e corrigir falhas.
2. Corrigir encoding.
3. Corrigir `Button`.
4. Criar migration de `status` em `actions`.
5. Consolidar Life Engine em `packages/engine`.
6. Melhorar tela Hoje.
7. Criar testes da engine.
