# CRUD V1

## Objetivo

Preparar os módulos principais para uso real com operações de criação, edição, exclusão, arquivamento e duplicação quando fizer sentido.

## Arquitetura

`features/crud/services/crud.service.ts` centraliza os contratos de CRUD usando Persistence Core e services existentes.

Módulos preparados:

- Metas.
- Hábitos.
- Diário.
- Treinos.
- Check-ins e corridas via Activity Engine.
- Sonhos.

## Regras

- Fallback local obrigatório.
- Supabase preparado, mas não implementado como fonte real nesta sprint.
- Nenhuma tela nova foi criada.
- O CRUD visual completo deve ser implementado por módulo nas próximas sprints, reutilizando estes contracts.

## Dívida técnica

Algumas telas ainda usam services legados diretamente. A migração visual deve ser incremental para evitar reescrita.
