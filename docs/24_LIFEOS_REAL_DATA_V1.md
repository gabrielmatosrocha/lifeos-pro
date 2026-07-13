# LifeOS Real Data V1

## Objetivo

Transformar `/app/hoje` em um painel vivo usando engines existentes, sem criar telas novas, IA real ou Supabase real.

## Integrações realizadas

A Home passa a consumir:

- Life Engine para HeroScore, ritmo, Life Score e pilares.
- Habits Engine para missões do dia, hábitos pendentes, streak e MiniStats.
- Activity Engine para treino, corrida, distância, volume e check-ins.
- Dream Engine para próxima meta e marco.
- Memory Engine para contexto espiritual e sinais pessoais.
- Coach Engine para Conselho do Dia.
- Review Engine para resumo semanal determinístico.
- Evolution Engine para comparação e resumo de evolução.

## Decisões

- Dados mockados continuam existindo apenas como fallback local/demo.
- A Home não chama Supabase diretamente.
- Widgets são gerados por `features/dashboard-widgets`.
- A reorganização futura dos widgets está preparada por `priority` e `kind`.

## Fora de escopo

- IA real.
- Supabase real.
- Novas telas.
- Notificações.
- GPS real.
