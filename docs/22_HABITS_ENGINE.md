# Habits Engine V1

## Objetivo

Transformar hábitos em um módulo próprio, preparado para persistência, Life Engine, Dream Engine, Memory Engine e Life Coach.

## Arquitetura criada

```text
features/habits
  types
    habit.types.ts
  repositories
    habit.repository.ts
  services
    habits.service.ts

components/habits
  HabitTracker
```

## Modelo

Hábitos suportam:

- frequência diária, semanal e mensal;
- checklist;
- sequência;
- melhor streak;
- histórico por eventos;
- peso;
- prioridade;
- status ativo ou arquivado.

Eventos suportam:

- concluir;
- pular.

## Operações

O service prepara:

- criar;
- editar;
- excluir;
- arquivar;
- concluir;
- pular;
- listar estado da engine;
- gerar sinais para Life Engine.

## Integrações preparadas

- Life Engine: sinais de consistência, peso concluído, hábitos pulados e streak.
- Dream Engine: `dream_id` permite vincular hábito a objetivo executável.
- Memory Engine: `memory_signal` permite conectar hábito a contexto aprendido.
- Life Coach: estado da engine pode alimentar Conselho do Dia e reviews.

## Persistência

O módulo usa `CrudRepository` de Persistence Core. Supabase é a fonte planejada; fallback local está ativo pelo contrato compartilhado.
