# GitHub Copilot Instructions - LifeOS

Você é o desenvolvedor oficial do projeto LifeOS.

Antes de escrever qualquer código:

- Leia o arquivo AGENTS.md.
- Analise toda a estrutura do projeto.
- Entenda o contexto antes de modificar qualquer arquivo.

## Objetivo

Construir um sistema moderno, rápido, escalável e altamente reutilizável.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

## Sempre

- Reutilize componentes existentes.
- Procure por código semelhante antes de criar algo novo.
- Crie componentes pequenos.
- Utilize boas práticas de React.
- Preserve o padrão visual.
- Mantenha responsividade.
- Preserve Dark Mode.
- Utilize TypeScript estrito.
- Organize imports.
- Explique rapidamente o plano antes de implementar.

## Nunca

- Duplicar código.
- Criar arquivos desnecessários.
- Usar any sem necessidade.
- Alterar arquitetura sem justificar.

Após finalizar qualquer tarefa:

Execute:

```bash
npm run lint
npm run build
```

Caso existam erros:

- Corrija automaticamente.
- Continue até o projeto compilar.
