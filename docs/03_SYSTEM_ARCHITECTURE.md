# System Architecture - LifeOS Pro

## Visao Geral

LifeOS Pro usa uma arquitetura web modular com Next.js no app principal, Supabase como backend opcional e uma camada inicial de engine para calculos de vida.

```text
Interface
  Next.js App Router, Tailwind, Framer Motion, componentes UI
Features
  actions, goals, journal, dashboard, auth, life-engine
Services
  leitura, escrita, fallback local, Supabase
Life Engine
  scores, pilares, ritmo, diagnosticos, recomendacoes
Data
  Supabase, localStorage, demo data
```

## App Web

Local: `apps/web`

Responsabilidades:

- Renderizar telas.
- Controlar experiencia do usuario.
- Integrar componentes visuais.
- Orquestrar servicos de feature.
- Proteger rotas autenticadas.

## Rotas Principais

- `/`
- `/login`
- `/app/hoje`
- `/app/evolucao`
- `/app/metas`
- `/app/diario`
- `/app/perfil`

O layout autenticado em `apps/web/app/app/layout.tsx` envolve as telas com `AuthGuard` e `AppNav`.

## Features

### Auth

Responsavel por login, cadastro, logout, usuario atual e fallback local via localStorage.

### Actions

Responsavel por criar acoes diarias, listar por data, atualizar estado, excluir, persistir localmente e sincronizar com Supabase quando disponivel.

### Goals

Responsavel por criar metas, listar metas, atualizar progresso e excluir metas.

### Journal

Responsavel por criar reflexoes, listar diario e excluir entradas.

### Dashboard

Responsavel por agregar acoes, metas e diario, rodar Life Engine e entregar resumo para a UI.

### Life Engine

Responsavel por calcular score por pilar, life score, rhythm index, classificacao e insight simples.

### Life Coach

Modulo planejado como camada de inteligencia orquestradora acima das engines. Deve consumir contexto de Life Engine, Dream Engine, Memory Engine, Evolution, Diario, Metas, Habitos e Perfil para gerar Conselho do Dia, insights, recomendacoes e Life Reviews.

Nesta etapa, o Life Coach existe apenas como arquitetura documentada em `docs/20_LIFE_COACH_PRD.md`. Nao ha IA real, chat, banco novo, push ou API externa implementados.

### Persistence Core

Camada de persistencia desacoplada documentada em `docs/21_PERSISTENCE_CORE.md`. Define repositories, storage, adapters e models para preparar Supabase como fonte principal mantendo fallback local.

### Habits Engine

Modulo de habitos documentado em `docs/22_HABITS_ENGINE.md`. Organiza habitos diarios, semanais e mensais, checklist, streak, historico, frequencia, peso e prioridade.

### Activity Engine

Modulo de academia e corrida documentado em `docs/23_ACTIVITY_ENGINE.md`. Organiza treinos, exercicios, corridas, caminhadas, historico, calendario, volume semanal, tempo total e distancia, com arquitetura preparada para GPS, Apple Watch, Strava, HealthKit e Google Fit.

## Backend e Banco

Supabase esta modelado em `supabase/migrations/0001_alpha_schema.sql`.

Tabelas:

- `profiles`
- `actions`
- `daily_summaries`
- `goals`
- `journal_entries`

Todas usam RLS para restringir acesso ao proprio usuario.

## Fallback Local

Quando Supabase nao esta configurado ou a sessao falha:

- auth usa usuarios locais em localStorage.
- actions, goals e journal usam localStorage.
- usuario demo e usado como fallback.

Isso e util para desenvolvimento e demo, mas deve ser separado com clareza da experiencia de producao.

## Direcao Arquitetural Recomendada

1. Tornar `packages/engine` a fonte canonica da Life Engine.
2. Tipar contratos compartilhados entre app e engine.
3. Criar adaptadores de persistencia: `local`, `supabase`, futuro `server`.
4. Evitar logica de negocio dentro de paginas.
5. Migrar regras de status para coluna propria no banco.
6. Criar camada de erros e feedbacks padronizados.
7. Adicionar testes da engine, servicos e fluxos principais.

## Fronteiras Importantes

- Paginas devem orquestrar experiencia, nao conter regra central.
- Componentes UI nao devem conhecer Supabase.
- Servicos nao devem depender de visual.
- Life Engine nao deve depender de React.
- Banco deve refletir conceitos de dominio, nao improvisos temporarios da UI.
