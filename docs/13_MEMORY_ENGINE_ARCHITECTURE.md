# Memory Engine Architecture - LifeOS Pro

## Objetivo

O Memory Engine é a camada responsável por armazenar e organizar contexto importante do usuário para que o LifeOS possa, futuramente, gerar insights, planos, alertas e sugestões mais inteligentes.

Nesta versão, a implementação é visual e mockada. Não há IA real, Supabase real ou alteração de banco.

## Escopo Entregue

- Seção `Memória do LifeOS` em `/app/perfil`.
- Cards de memória com título, descrição, categoria, origem, confiança e última atualização.
- Insight inteligente mockado.
- Timeline curta com eventos aprendidos pelo LifeOS.

## Arquitetura

```text
features/memory
  types
    memory.types.ts
  services
    memory.service.ts

components/memory
  MemoryDashboard
  MemoryCard
  MemoryInsight
  MemoryTimeline

app/app/perfil
  Orquestra perfil atual + Memory Engine mockado
```

## Categorias Iniciais

- sonho
- hábito
- rotina
- treino
- espiritualidade
- estudo
- saúde
- meta
- preferência

## Preparação Futura

O contrato atual prepara integração futura com:

- IA real por adaptadores desacoplados.
- Supabase para persistência.
- Diário como fonte de reflexões e padrões.
- Dream Engine e futura Life Vision.
- Hábitos, treinos, notificações e personalização.

## Restrições Desta Sprint

- Não há IA real.
- Não há Supabase real.
- Não há nova migration.
- O fluxo existente de perfil e logout foi preservado.
