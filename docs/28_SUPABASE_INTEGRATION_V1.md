# Supabase Integration V1

## Objetivo

Começar a substituir persistência mockada por repositories reais com Supabase como fonte principal e fallback local obrigatório.

## Implementado

- `createSupabaseRepository` com CRUD real.
- Fallback automático para local repository em caso de Supabase ausente ou erro.
- Storage service preparado para upload/remove.
- Migration incremental para:
  - dreams;
  - habits;
  - habit_events;
  - workouts;
  - activity_sessions;
  - reviews;
  - memories;
  - profiles preferences.

## Modelos preparados

- Dream.
- Habits.
- Journal.
- Activity.
- Review.
- Memory.

## Regras

- Nenhum componente deve chamar Supabase diretamente.
- Services usam repositories.
- Fallback local permanece.
- RLS deve proteger todos os dados por `user_id`.

## Próximo passo

Migrar cada tela para CRUD visual completo usando os repositories, começando por Metas, Diário e Hábitos.
