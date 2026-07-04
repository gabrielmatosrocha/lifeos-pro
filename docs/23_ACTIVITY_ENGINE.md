# Activity Engine V1

## Objetivo

Transformar academia e corrida em módulos reais, ainda sem GPS, mas preparados para integrações futuras.

## Arquitetura criada

```text
features/activity
  types
    activity.types.ts
  repositories
    activity.repository.ts
  services
    activity.service.ts

components/activity
  ActivityDashboard
  ActivitySummary
  ActivityCalendar
  WorkoutCard
  WorkoutHistory
  RunCard
  RunHistory
```

## Workout Engine

Suporta:

- treinos;
- exercícios;
- grupos musculares;
- check-in;
- histórico;
- volume semanal;
- tempo total;
- status planejado, concluído, pulado ou arquivado.

## Running Engine

Suporta:

- corridas;
- caminhadas;
- distância;
- tempo;
- pace;
- histórico;
- preparação para rota futura.

## Integrações futuras

Arquitetura preparada para:

- GPS;
- Apple Watch;
- Strava;
- HealthKit;
- Google Fit.

## Integrações internas

- Life Engine: volume, tempo, distância e frequência física.
- Memory Engine: preferência de treino e padrões de recuperação.
- Coach Engine: recomendações educativas de consistência, descanso e progressão segura.
- Evolution Engine: histórico, calendário, comparativos e tendências.

## Persistência

O módulo usa `CrudRepository` de Persistence Core e mantém fallback local até as migrations Supabase serem implementadas.
