# LifeOS Pro — Alpha 1.0

**Disciplina • Fé • Evolução**

LifeOS Pro é um sistema operacional pessoal para viver cada dia com mais clareza, equilíbrio e consistência.

## Alpha 1.0

Esta versão consolida os builds anteriores em uma base única.

### Inclui

- Landing Page
- Login visual
- Layout interno
- Navegação principal
- Hoje
- Evolução
- Metas
- Diário
- Perfil
- Actions
- Life Engine
- Supabase schema
- Documentação inicial

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL

## Como rodar

```bash
npm install
npm run dev
```

Depois acesse:

```txt
http://localhost:3000
```

## Variáveis de ambiente

Crie `.env.local` dentro de `apps/web`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

## Banco

Rode as migrações dentro de `supabase/migrations`.

## Filosofia

O LifeOS não existe para ocupar sua vida com mais telas.  
Ele existe para ajudar você a viver melhor o dia de hoje.
