# Alpha QA Report - LifeOS

Data: 2026-07-09

## Escopo

Auditoria curta das sprints Daily Flow V1, Remove Mocks V1 e LifeOS Alpha QA.

Rotas e módulos considerados:

- `/login`
- `/app/hoje`
- `/app/metas`
- `/app/diario`
- `/app/evolucao`
- `/app/perfil`
- Auth, Dashboard, CRUD, Dream Engine, Memory Engine, Habits, Activity, Coach, Review e Persistence Core.

## Daily Flow V1

### Resultado

`/app/hoje` agora prioriza o fluxo diário principal:

1. Conselho do Dia.
2. Missões e hábitos.
3. Hábitos pendentes.
4. Meta prioritária.
5. Treino sugerido.
6. Check-in rápido.
7. Diário.
8. Life Review.

### Ajustes realizados

- Criado painel `DailyFlow` para concentrar as informações essenciais do dia.
- Removida a dependência do grid amplo de widgets na Home para reduzir redundância e densidade visual.
- Quick Actions agora navegam para rotas existentes:
  - Metas: `/app/metas`
  - Check-ins e evolução: `/app/evolucao`
  - Diário: `/app/diario`
- MiniStats continuam consumindo sinais de Habits, Activity e Dream Engine.
- Home deixou de iniciar com `demoActions`; usa estado local/persistido e engines existentes.
- Corrigido fallback de sessão local quando a validação do Supabase não responde em tempo hábil.

## Inventário de Mocks

| Arquivo | Tipo do mock | Prioridade | Dependências | Sugestão de migração |
| --- | --- | --- | --- | --- |
| `apps/web/app/app/hoje/page.tsx` | Fallback direto para `demoActions` na Home | Crítico | Actions, Life Engine, Dashboard | Substituído nesta sprint por fallback local via Persistence/Actions. |
| `apps/web/features/demo/demo-data.ts` | Dados demo de ações | Importante | Life Engine, documentação legada | Manter temporariamente como seed/demo isolado; remover quando todos os fluxos usarem repositories. |
| `apps/web/features/habits/services/habits.service.ts` | `demoHabits` e `demoHabitEvents` quando repository está vazio | Importante | Persistence Core, HabitTracker, Dashboard | Migrar para seed controlado por usuário ou onboarding; repository local já existe. |
| `apps/web/features/activity/services/activity.service.ts` | `demoWorkouts` e `demoRuns` quando repository está vazio | Importante | Activity Engine, Evolução, Dashboard | Migrar para estado vazio premium + criação real de treino/check-in. |
| `apps/web/features/dreams/services/dream.service.ts` | Dream Engine mockado | Importante | Metas, Coach, Memory | Conectar a Dream Repository quando CRUD de sonhos estiver consolidado. |
| `apps/web/features/memory/services/memory.service.ts` | Memory Engine mockado | Importante | Perfil, Coach, Daily Flow | Conectar a Memory Repository e sinais reais do diário/hábitos/atividade. |
| `apps/web/features/evolution/services/evolution-history.service.ts` | Histórico, check-ins, atividade e storage mockados | Importante | Evolução, Activity, Storage | Trocar por Activity Repository + Storage Service quando upload/persistência real forem ativados. |
| `apps/web/components/evolution/*` | Textos e CTAs “mockados” | Baixo impacto | Evolução visual | Substituir por estados “em breve” ou “prévia” quando o fluxo real existir. |
| `apps/web/features/*/services/*` | Usuário `demo` para fallback local | Baixo impacto | Auth local, Supabase opcional | Preservar no alpha; remover somente quando Supabase Auth/RLS estiver obrigatório. |

## Mocks Substituídos Nesta Sprint

- `apps/web/app/app/hoje/page.tsx`
  - Removido import de `demoActions`.
  - Estado inicial da Home agora parte de `loadDailyActions()` ou lista vazia.
  - `Life Engine` inicial roda sem seed demo artificial.

## QA Funcional

| Área | Classificação | Observação | Ação recomendada |
| --- | --- | --- | --- |
| Login/Cadastro/Recuperação | Melhoria Arquitetural | Fluxo depende de Supabase quando configurado e fallback local em desenvolvimento. | Testar com ambiente Supabase real antes do Alpha público. |
| Logout/Sessão | Melhoria UX | Necessário validar estados de sessão expirada e feedback visual. | Criar QA manual dedicado de Auth V1. |
| Home/Dashboard | Melhoria UX | Havia repetição entre widgets e missões rápidas. | Corrigido com `DailyFlow`. |
| Auth fallback | Bug médio | A validação podia permanecer em “Validando sessão...” quando Supabase não respondia. | Corrigido com timeout curto e retorno ao fallback local. |
| Metas/Dream Engine | Bug leve | Alguns dados ainda são mockados por design. | Integrar Dream Repository na próxima etapa de dados reais. |
| Hábitos | Melhoria Arquitetural | Engine existe, mas criação/edição completa precisa ser testada ponta a ponta. | QA funcional focado no CRUD local. |
| Diário | Melhoria UX | Precisa validar estados vazio, erro e edição em mobile. | Adicionar checklist manual por fluxo. |
| Activity/Evolução | Melhoria UI | Alguns CTAs ainda usam linguagem de mock. | Ajustar linguagem quando a persistência real entrar. |
| Memory Engine | Melhoria Arquitetural | Memórias ainda são determinísticas/mockadas. | Persistir memórias derivadas de eventos reais. |
| Coach Engine | Melhoria Arquitetural | Conselho é determinístico, sem IA real, conforme guardrails. | Evoluir com camada de provider desacoplado. |
| Review Engine | Melhoria UX | Review aparece no fluxo diário, mas ainda precisa do fechamento diário real. | Criar ação de fechamento quando o CRUD estiver estável. |
| Responsividade | Melhoria UI | Home precisava reduzir densidade na primeira dobra. | Corrigido com painel compacto e remoção de grid redundante. |
| Acessibilidade | Melhoria UX | Botões principais têm texto; próxima auditoria deve validar navegação por teclado em todas as rotas. | Rodar QA manual com foco visível e leitura por tela. |
| Performance | Melhoria Performance | Home carrega várias engines no client. | Avaliar cache/memoização por engine e reduzir chamadas quando Supabase real entrar. |

## Riscos Futuros

- Mocks importantes ainda sustentam a experiência demo de Habits, Activity, Dreams, Memory e Evolution.
- Existem tipos com texto acentuado corrompido herdado em alguns contratos; corrigir exige migração cuidadosa para não quebrar comparações.
- Middleware atual em Next pode exigir migração futura para o padrão mais recente de proxy.
- Supabase real precisa ser validado com RLS, migrations e dados multiusuário antes de uso público.

## Checklist Alpha

- Typecheck: aprovado.
- Lint: aprovado.
- Build: aprovado.
- Screenshots: geradas em `docs/screenshots/daily-flow-v1/`.

## Screenshots Geradas

- `docs/screenshots/daily-flow-v1/hoje-desktop-1440x900.png`
- `docs/screenshots/daily-flow-v1/hoje-mobile-390x844.png`

## Próximas Recomendações

1. QA manual completo de Auth com Supabase real configurado.
2. Substituir mocks importantes de Habits e Activity por estados reais persistidos.
3. Criar seed/onboarding opcional em vez de fallback demo invisível.
4. Revisar linguagem “mockada” nos componentes de Evolução antes do Alpha externo.
5. Auditar acentuação dos tipos e textos legados com uma migração controlada.
