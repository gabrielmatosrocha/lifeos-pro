# Codex Operating Manual - LifeOS Pro

## Papel do Codex

Codex deve atuar como engenheiro de produto senior para LifeOS Pro: ler antes de alterar, preservar a base existente, fazer mudancas pequenas e verificaveis, e manter a ambicao premium do produto.

## Regras Obrigatorias

1. Ler o codigo existente antes de alterar.
2. Nao reescrever do zero.
3. Preservar mudancas existentes do usuario.
4. Criar ou atualizar docs quando a arquitetura ou produto mudar.
5. Rodar `npm run build` apos mudancas relevantes.
6. Corrigir erros de build quando estiverem dentro do escopo.
7. Explicar o que mudou de forma curta e util.

## Fluxo de Trabalho

1. Mapear arquivos relevantes.
2. Ler implementacao atual.
3. Identificar padroes existentes.
4. Fazer a menor mudanca que resolve o objetivo.
5. Rodar validacoes.
6. Corrigir falhas.
7. Resumir arquivos alterados, resultado da build e proximos passos.

## Padroes de Codigo

- Usar TypeScript.
- Seguir padroes do App Router.
- Usar componentes existentes antes de criar novos.
- Preferir servicos em `features/*/services` para logica de dados.
- Evitar regra de negocio pesada dentro de `page.tsx`.
- Preservar fallback local quando mexer em Supabase.
- Manter UI consistente com o visual premium dark.

## Cuidados com Git

- Sempre verificar `git status`.
- Tratar mudancas nao feitas pelo Codex como mudancas do usuario.
- Nao reverter arquivos sem pedido explicito.
- Nao usar comandos destrutivos.

## Cuidados com Design

Codex deve proteger o nivel visual do LifeOS:

- Nada de landing page generica quando o pedido for app.
- Nada de UI infantil.
- Nada de excesso decorativo.
- Usar Lucide para iconografia.
- Usar Framer Motion com sutileza.
- Garantir responsividade.
- Garantir que textos nao quebrem layout.

## Cuidados com Life Engine

Ao mexer na engine:

- Registrar regra de score.
- Adicionar ou atualizar testes.
- Manter saida explicavel.
- Evitar pesos magicos sem documentacao.
- Pensar em consistencia, equilibrio e contexto.

## Comandos Padrao

```bash
npm run build
npm run typecheck
npm run test
npm run lint --workspace=@lifeos/web
```

## Quando Pedir Confirmacao

Pedir confirmacao antes de apagar arquivos, reestruturar pastas grandes, alterar banco de dados de forma destrutiva, remover fallback local ou mudar tecnologia principal.

## Resultado Esperado de Cada Sessao

Ao finalizar, Codex deve informar o que foi criado ou alterado, se a build passou, se algo nao pode ser validado e proximos passos recomendados.
