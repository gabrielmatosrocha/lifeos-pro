# Auth System V1

## Objetivo

Transformar o LifeOS em uma base multiusuário, com Supabase Auth como caminho principal e fallback local preservado para desenvolvimento/demo.

## Arquitetura

```text
features/auth
  types
    auth.types.ts
  repositories
    auth.repository.ts
  services
    auth.service.ts

features/users
  types
    user.types.ts
  repositories
    user.repository.ts

features/profile
  types
    profile.types.ts
  repositories
    profile.repository.ts
```

## Implementado

- Login real com Supabase Auth quando env vars existem.
- Cadastro.
- Logout.
- Recuperação de senha.
- Sessão persistente no browser.
- Middleware protegendo `/app/*` quando Supabase está configurado.
- Fallback local quando Supabase não está configurado.
- ProfileRepository com preferências.
- Migration incremental para `profiles.preferences`.

## Preferências

Preferências iniciais:

- tema dark;
- Coach ativo;
- conteúdo espiritual configurável;
- frequência de notificações;
- foco principal.

## Integrações preparadas

- Dream Engine.
- Memory Engine.
- Habits.
- Activity.
- Coach.

Esses módulos devem consumir `user_id` via UserRepository/AuthService e persistir por repositories desacoplados.
