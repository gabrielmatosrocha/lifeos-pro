# Evolution Intelligence Architecture - LifeOS Pro

## Objetivo

Esta sprint cria a primeira arquitetura visual e mockada para transformar `/app/evolucao` em uma área de histórico, saúde, treinos, corrida, inteligência pessoal e analytics.

## Escopo Entregue

- Histórico de Evolução com visões diária, semanal, mensal e anual.
- Check-in Academia mockado.
- Check-in Corrida mockado.
- Histórico de treinos.
- PhotoUpload mockado preparado para Supabase Storage.
- Modo Atividade mockado para futura Geolocation API/PWA/mobile.
- Life Coach com orientações educativas e não médicas.
- Life Intelligence para notificações inteligentes.
- Espiritualidade configurável em arquitetura.
- Life Analytics com tendências e comparativos.

## Arquitetura

```text
features/evolution
  types
  services
components/evolution
  visualizações reutilizáveis
app/app/evolucao
  orquestra dashboard atual + histórico mockado
```

## Persistência Futura

Os dados desta sprint são mockados em `getEvolutionHistoryMock`, mas os contratos foram separados para futura integração com Supabase:

- tabelas para gym_check_ins;
- tabelas para run_check_ins;
- tabela para activity_sessions;
- bucket Supabase Storage para fotos;
- tabelas para smart_reminders e notification_preferences.

## Segurança de IA

O Life Coach deve fornecer orientação geral e educativa. Ele não deve substituir médicos, nutricionistas ou educadores físicos, nem gerar prescrições médicas.
