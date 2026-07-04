# Environment - LifeOS Pro

## Objetivo

Este documento registra a configuracao minima de ambiente para desenvolvimento, validacao e deploy do LifeOS Pro.

## Runtime

- Node.js compativel com Next.js atual do projeto.
- npm workspaces como gerenciador oficial nesta fase.
- Vercel como alvo de deploy do app web.

## Workspaces

O repositorio usa npm workspaces:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Workspaces atuais:

- `@lifeos/web`: aplicativo Next.js.
- `@lifeos/engine`: pacote inicial da Life Engine.

Comandos oficiais na raiz:

```bash
npm run dev
npm run typecheck
npm run lint --workspace=@lifeos/web
npm run test
npm run build
```

## Variaveis de Ambiente

O app funciona em modo local/demo sem Supabase. Para usar Supabase real, configurar:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Fallback Local

Quando as variaveis Supabase nao existem, o app usa localStorage para autenticacao local, acoes, metas e diario. Esse comportamento e intencional para desenvolvimento e demos, mas deve ser tratado com clareza antes de producao.

## Definition of Done de Ambiente

- `npm run typecheck` passa em todos os workspaces.
- `npm run lint --workspace=@lifeos/web` passa.
- `npm run build` passa.
- Artefatos de TypeScript, como `*.tsbuildinfo`, permanecem fora do Git.
