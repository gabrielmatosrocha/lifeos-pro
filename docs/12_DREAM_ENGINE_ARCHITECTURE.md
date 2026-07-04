# Dream Engine Architecture - LifeOS Pro

## Objetivo

O Dream Engine transforma sonhos do usuário em metas, etapas, hábitos e próximos passos. Nesta versão, a implementação é visual e mockada, sem IA real, sem Supabase real e sem alteração de banco.

## Escopo Entregue

- Seção Sonhos em `/app/metas`.
- Lista de sonhos com status, prazo, área da vida, progresso e próxima ação.
- Estrutura visual para criar um novo sonho.
- Plano mockado com decomposição:
  - Sonho.
  - Meta anual.
  - Meta mensal.
  - Meta semanal.
  - Hábito diário.
  - Próxima ação.
- Insight inteligente mockado.

## Arquitetura

```text
features/dreams
  types
    dream.types.ts
  services
    dream.service.ts

components/dreams
  DreamList
  DreamPlanCard
  DreamInsight
  DreamComposerCard

app/app/metas
  Orquestra metas existentes + Dream Engine mockado
```

## Preparação Futura

O contrato atual prepara integração futura com:

- IA para decompor sonhos em planos.
- Supabase para persistência.
- Notificações inteligentes.
- Hábitos e ações diárias.
- Calendário e revisões semanais.

## Restrições Desta Sprint

- Não há IA real.
- Não há upload, GPS ou integração externa.
- Não há nova migration.
- O fluxo existente de metas foi preservado.

## Separação Conceitual - Metas e Life Vision

Em `/app/metas`, o Dream Engine deve mostrar apenas objetivos executáveis com horizonte de até 12 meses. Exemplos: correr 10 km, ler 12 livros no ano, economizar R$ 10.000, estudar inglês por 6 meses, completar um curso ou criar uma rotina saudável.

Grandes sonhos de muitos anos, como comprar uma casa, abrir uma empresa, independência financeira, missão, legado e visão de futuro, não devem ser tratados como metas operacionais. Eles pertencem a uma futura área chamada provisoriamente de `Life Vision`.

Nesta sprint, os mocks da tela `Metas` foram ajustados para reduzir sobrecarga cognitiva e manter foco em execução acompanhável.
