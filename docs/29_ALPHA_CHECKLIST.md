# LifeOS Alpha Checklist

## Status geral

LifeOS está se aproximando de um Alpha utilizável diariamente, com cockpit `/app/hoje`, engines iniciais, auth multiusuário, persistência Supabase preparada e fallback local.

## Checklist Alpha

- [x] Login.
- [x] Cadastro.
- [x] Logout.
- [x] Recuperação de senha.
- [x] Sessão persistente.
- [x] Middleware de proteção quando Supabase está configurado.
- [x] Perfil básico.
- [x] Preferências iniciais.
- [x] Life Engine.
- [x] Dream Engine.
- [x] Memory Engine.
- [x] Habits Engine.
- [x] Activity Engine.
- [x] Coach determinístico.
- [x] Dashboard vivo.
- [x] Persistence Core.
- [x] Supabase migrations preparadas.
- [x] Fallback local.
- [ ] CRUD visual completo em todas as telas.
- [ ] QA visual final mobile/desktop.
- [ ] Testes automatizados principais.
- [ ] Observabilidade básica.

## Bugs conhecidos

- Alguns documentos antigos ainda exibem acentuação corrompida no terminal.
- CRUD V1 está arquitetural; nem todos os módulos possuem UI completa de editar/duplicar/arquivar.
- Middleware protege rotas apenas quando Supabase está configurado; fallback local segue protegido por AuthGuard client-side.
- Storage está preparado, mas upload real ainda não foi conectado a UI.
- Migrations novas ainda precisam ser aplicadas no projeto Supabase real.

## Melhorias recomendadas

- Criar testes para Persistence Core.
- Criar QA visual de `/app/hoje` após Dashboard V2.
- Migrar telas para repositories novos gradualmente.
- Criar telas/controles de preferências reais.
- Adicionar skeletons mais ricos em telas internas.
- Revisar acessibilidade de formulários longos.

## Roadmap Beta

1. Aplicar migrations em Supabase.
2. Conectar CRUD visual de Metas, Diário, Hábitos e Atividade.
3. QA visual completo desktop/mobile.
4. Testes automatizados de auth, repositories e engines.
5. Storage real para fotos mockadas.
6. Preferências reais de Coach e espiritualidade.
7. Observabilidade básica.
8. Deploy preview e checklist de privacidade.
