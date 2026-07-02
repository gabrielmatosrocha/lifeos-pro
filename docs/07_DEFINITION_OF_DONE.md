# Definition of Done - LifeOS Pro

## Regra Geral

Uma entrega so esta pronta quando funciona, esta visualmente coerente, preserva o que ja existe e passa pelos checks combinados.

## Checklist de Produto

- O fluxo principal esta completo.
- O usuario entende o que fazer.
- Estados vazio, carregando, sucesso e erro existem quando aplicavel.
- A experiencia funciona em mobile e desktop.
- O texto esta claro, sem acentuacao quebrada.
- A mudanca reforca a visao de Sistema Operacional Pessoal.

## Checklist Visual

- Visual dark premium preservado.
- Hierarquia clara.
- Componentes alinhados ao design system.
- Sem sobreposicao de texto.
- Sem cards desnecessariamente aninhados.
- Movimento sutil e funcional.
- Icones Lucide quando apropriado.
- Contraste adequado.

## Checklist Tecnico

- `npm run build` passa.
- `npm run typecheck` passa quando aplicavel.
- `npm run lint` passa quando aplicavel.
- Tipos principais estao corretos.
- Sem `any` desnecessario em codigo novo.
- Sem regra de negocio duplicada em pagina quando houver servico adequado.
- Sem reescrita desnecessaria de partes existentes.
- Sem apagar mudancas do usuario.

## Checklist de Dados

- Dados sao isolados por usuario.
- Fallback local continua funcionando.
- Supabase continua funcionando quando configurado.
- Migrations sao incrementais.
- RLS e considerada em alteracoes de banco.
- Mudancas de schema sao documentadas.

## Checklist de Life Engine

- Score tem regra explicavel.
- Testes cobrem casos principais.
- Pilares estao normalizados.
- Mudancas de peso sao documentadas.
- Insights sao acionaveis e nao genericos.

## Checklist de Acessibilidade

- Inputs tem labels.
- Botoes tem texto ou aria-label.
- Foco de teclado e perceptivel.
- Contraste e aceitavel.
- Elementos interativos tem area de toque adequada.

## Checklist de Documentacao

- Docs relevantes atualizados.
- Decisoes arquiteturais importantes registradas.
- Novos fluxos descritos quando alteram produto.
- Dividas tecnicas novas documentadas se nao forem resolvidas no mesmo PR.

## Pronto para Merge

Uma mudanca pode ser considerada pronta para merge quando build passa, fluxo foi testado manualmente, nao ha regressao obvia nas telas existentes, documentacao foi atualizada quando necessario e o resultado melhora ou preserva a qualidade premium do LifeOS.
