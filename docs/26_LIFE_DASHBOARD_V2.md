# Life Dashboard V2

## Objetivo

Transformar `/app/hoje` no centro vivo do LifeOS, inspirado em Apple Fitness, Vision Pro, Things 3 e Linear.

## Arquitetura criada

```text
features/dashboard-widgets
  types
    dashboard-widget.types.ts
  services
    dashboard-widgets.service.ts

components/dashboard-widgets
  DashboardWidgetGrid
```

## Widgets inteligentes

Widgets preparados:

- Hoje.
- Conselho do Coach.
- Próxima Meta.
- Hábitos pendentes.
- Treino do dia.
- Corrida sugerida.
- Resumo da semana.
- Resumo espiritual.
- Último registro do diário.
- Streak.
- Próxima conquista.
- Próximo marco.

## Reorganização futura

Cada widget possui:

- `id`
- `kind`
- `priority`
- `title`
- `value`
- `description`

Isso permite futura reordenação, personalização e preferências sem alterar o contrato visual.

## Princípio

Nenhum widget deve depender de dado hardcoded. Todos devem receber sinais das engines existentes ou fallback local documentado.
