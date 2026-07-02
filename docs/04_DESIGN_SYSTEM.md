# Design System - LifeOS Pro

## Direcao Visual

LifeOS Pro deve ter visual premium, luxuoso e funcional, inspirado por Apple Vision Pro, Apple Fitness, Things 3 e Superhuman.

A linguagem deve equilibrar calma e energia: fundo escuro, materiais translucidos, profundidade sutil, tipografia limpa, movimento elegante e feedback instantaneo.

## Principios

1. Premium sem ruido.
2. Clareza antes de decoracao.
3. Profundidade controlada.
4. Movimento como feedback.
5. Mobile como cockpit.

## Paleta Atual

Tokens em `apps/web/app/globals.css`:

- Background: `#09090b`
- Card: `#18181b`
- Card elevated: `#27272a`
- Primary: `#0a84ff`
- Success: `#30d158`
- Warning: `#ff9f0a`
- Danger: `#ff453a`
- Text: `#f9fafb`
- Muted: `#a1a1aa`
- Border: `rgba(255, 255, 255, 0.08)`

Extensao Tailwind em `apps/web/tailwind.config.ts`:

- `lifeos.dark`
- `lifeos.blue`
- `lifeos.green`
- `lifeos.amber`
- `lifeos.red`
- `lifeos.background`

## Materiais

Padrao recomendado:

- Fundo base quase preto.
- Superficies `bg-zinc-900/70` ou `bg-white/[0.03]`.
- Bordas `border-white/10`.
- Blur `backdrop-blur-xl` ou `backdrop-blur-2xl`.
- Sombras profundas, discretas e suaves.
- Gradientes apenas quando reforcarem significado.

## Tipografia

Fonte atual: Inter, system UI e fallback sans.

Direcao:

- Titulos com peso 700.
- Labels e metadados com `text-sm`.
- Textos secundarios em zinc/slate 400 ou 500.
- Evitar tamanhos hero dentro de cards pequenos.
- Evitar letter spacing negativo como dependencia visual.

## Componentes Base

### Card

Usado para agrupar informacao ou formulario. Deve manter padding generoso e evitar cards dentro de cards. Recomenda-se padronizar variantes: default, elevated, interactive e danger.

### Button

Usado para acoes claras. Deve ter estados loading, disabled e destructive. Divida atual: `Button` sobrescreve `className`, dificultando variacoes.

### AppNav

Navegacao principal mobile. Deve indicar rota ativa, ser acessivel e nao cobrir conteudo relevante.

### HeroScore

Comunica estado do dia. Deve evoluir para visual circular ou anel de progresso inspirado em Apple Fitness.

## Iconografia

Biblioteca: Lucide React.

Regras:

- Preferir icones Lucide em botoes e nav.
- Evitar emoji como interface principal em areas premium.
- Emoji pode existir como conteudo emocional pontual, mas nao como sistema visual.

## Motion

Biblioteca: Framer Motion.

Regras:

- Entrada suave em telas e cards.
- Transicoes entre estados rapidas e elegantes.
- Evitar animacao decorativa sem feedback.
- Duracao padrao entre 0.2s e 0.7s.

## Acessibilidade

Cada entrega visual deve checar contraste, foco visivel, labels em inputs, botoes com texto ou aria-label, estados disabled perceptiveis e navegacao mobile sem sobreposicao de conteudo.

## Qualidade Apple Design Award

Antes de considerar uma tela pronta, perguntar:

- A primeira impressao e memoravel?
- A hierarquia visual esta obvia?
- O usuario sabe o proximo passo?
- Os estados vazios parecem desenhados?
- O movimento aumenta compreensao?
- O app parece LifeOS, nao template SaaS generico?
