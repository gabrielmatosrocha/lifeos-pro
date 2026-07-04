# Persistence Core V1

## Objetivo

Começar a substituir dados mockados por uma arquitetura de persistência real, sem implementar autenticação completa, IA, notificações ou novas migrations nesta sprint.

## Arquitetura criada

```text
features/persistence
  types
    persistence.types.ts
  storage
    local-storage.adapter.ts
  adapters
    supabase.adapter.ts
  repositories
    local.repository.ts
    repository-factory.ts
    domain.repositories.ts
```

## Princípios

- Nenhum módulo de domínio deve depender diretamente do Supabase.
- Supabase é a fonte principal planejada.
- LocalStorage segue como fallback e ambiente demo.
- CRUD é exposto por interfaces desacopladas.
- Migrations futuras devem ser incrementais e respeitar RLS.

## Repositories

O contrato `CrudRepository<T>` define:

- `list`
- `getById`
- `create`
- `update`
- `delete`

Modelos preparados:

- Metas.
- Sonhos.
- Diário.
- Check-ins de academia.
- Check-ins de corrida/caminhada.
- Treinos.
- Hábitos.
- Eventos de hábitos.
- Sessões de atividade.

## Supabase

`supabase.adapter.ts` mapeia modelos para tabelas planejadas. Enquanto migrations reais não são adicionadas para todos os modelos, `repository-factory.ts` usa o repositório local com o mesmo contrato.

## Próximas migrations planejadas

- `dreams`
- `gym_check_ins`
- `run_check_ins`
- `workouts`
- `habits`
- `habit_events`
- `activity_sessions`

Cada tabela deve incluir:

- `id`
- `user_id`
- `created_at`
- `updated_at`
- RLS por usuário.

## Fora de escopo

- Autenticação completa.
- IA.
- Push notifications.
- Realtime.
- Upload real.
- GPS real.
