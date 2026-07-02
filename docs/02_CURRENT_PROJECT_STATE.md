# Current Project State - LifeOS Pro

## Raiz do Projeto

`C:\Users\Gabriel Matos\Downloads\lifeos-pro-alpha-1-0`

## Stack Atual

- Next.js, React e App Router.
- TypeScript.
- Tailwind CSS.
- Framer Motion.
- Lucide React.
- Supabase com fallback local.
- npm workspaces.
- Git, GitHub e Vercel como direcao de entrega.

## Estrutura Atual

```text
apps/web
  app
    app/hoje
    app/evolucao
    app/metas
    app/diario
    app/perfil
    login
  components
    auth
    dashboard
    layout
    ui
  features
    actions
    auth
    dashboard
    demo
    goals
    journal
    life-engine
  lib/supabase
packages/engine
supabase/migrations
docs
```

## Scripts

Na raiz:

- `npm run dev`: inicia `@lifeos/web`.
- `npm run build`: roda build do app web.
- `npm run typecheck`: roda typecheck por workspace quando existir.
- `npm run test`: roda testes por workspace quando existir.

No app web:

- `next dev`.
- `next build`.
- `next start`.
- `tsc --noEmit`.
- `eslint .`.

## Estado das Telas

### Hoje

Arquivo: `apps/web/app/app/hoje/page.tsx`

Funcionalidades existentes:

- Carrega acoes demo, localStorage ou Supabase.
- Cria acoes diarias.
- Marca acoes como concluidas ou pendentes.
- Exclui acoes.
- Mostra HeroScore com `rhythmIndex`, classificacao e insight.
- Mostra mini estatisticas fixas.
- Mostra pontuacao por pilar.

### Metas

Arquivo: `apps/web/app/app/metas/page.tsx`

Funcionalidades existentes:

- Lista metas.
- Cria meta.
- Atualiza progresso.
- Exclui meta.
- Usa fallback local e servico de metas.

### Diario

Arquivo: `apps/web/app/app/diario/page.tsx`

Funcionalidades existentes:

- Lista entradas do diario.
- Cria reflexao.
- Exclui reflexao.
- Usa fallback local e servico de diario.

### Evolucao e Perfil

Existem rotas em `apps/web/app/app/evolucao/page.tsx` e `apps/web/app/app/perfil/page.tsx`. Devem evoluir como superficies de analytics e identidade.

## Componentes Existentes

- `AppNav`
- `BackgroundGlow`
- `Card`
- `Button`
- `Badge`
- `Progress`
- `MiniStat`
- `StatCard`
- `HeroScore`
- `AuthGuard`

## Life Engine Atual

Ha duas camadas:

- `packages/engine/src/index.ts`: contem `calculateRhythm(actionsCount)`.
- `apps/web/features/life-engine/services/life-engine.service.ts`: engine usada pelo dashboard.

A engine do app calcula score por pilares, `lifeScore`, `rhythmIndex`, classificacao e insight textual.

## Dados e Persistencia

O projeto usa abordagem hibrida:

- Supabase quando configurado.
- localStorage quando Supabase nao esta disponivel.
- Dados demo para primeira experiencia.

Tabelas iniciais no Supabase:

- `profiles`
- `actions`
- `daily_summaries`
- `goals`
- `journal_entries`

## Estado Visual

O projeto ja aponta para visual dark premium:

- Fundo `#09090B`.
- Cards translucidos.
- Bordas brancas com baixa opacidade.
- Blur e glow.
- Gradientes em cyan, sky, emerald, fuchsia e violet.
- Navegacao inferior fixa.
- Motion com Framer Motion.

## Dividas Tecnicas Observadas

- Alguns textos com acentuacao aparecem corrompidos em arquivos do app.
- `Button` ignora `className` recebido porque sobrescreve a prop; isso pode quebrar variacoes visuais esperadas.
- `actions` no banco nao possui coluna explicita de `status`; o app modela status via `notes` e tipo opcional.
- `category` aparece em `LifeAction`, mas a tabela usa `pillar`.
- `packages/engine` ainda nao esta integrado ao app como fonte canonica da engine.
- Alguns docs existentes estao vazios ou parciais.
- Estados de erro ainda sao silenciosos em varios servicos.
- Testes automatizados ainda parecem iniciais.

## Regra de Preservacao

Toda evolucao deve preservar o projeto atual. Nao reescrever do zero. Nao apagar docs ou componentes existentes sem decisao explicita.
