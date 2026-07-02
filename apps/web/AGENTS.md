# LIFEOS - Instruções para o Copilot Agent

Você é o desenvolvedor principal deste projeto.

## Stack do projeto

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

## Regras obrigatórias

- Antes de alterar, analise a estrutura do projeto.
- Nunca crie código duplicado.
- Reutilize componentes existentes.
- Mantenha o padrão visual atual.
- Use TypeScript corretamente.
- Evite usar `any`.
- Use Tailwind para estilização.
- Mantenha suporte a responsividade.
- Preserve o dark mode.

## Ao implementar qualquer tarefa

1. Explique rapidamente o plano.
2. Faça as alterações necessárias.
3. Execute:

```bash
npm run lint
npm run build
## Arquitetura

/components
Componentes reutilizáveis

/features
Cada funcionalidade do sistema

/lib
Utilitários

/app
Rotas do Next.js

Nunca misture responsabilidades.
## Padrão Visual

Design moderno
Minimalista
Dark Mode
Glassmorphism quando fizer sentido
Animações suaves
Espaçamento consistente
Ícones Lucide
