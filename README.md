# Jovem Nuggs FC — Site do Clube

Site estatístico do clube **Jovem Nuggs FC** (EA Sports FC, Pro Clubs), com visão geral,
elenco, histórico de partidas e perfis de jogador — alimentado pelos dados públicos
(não-oficiais) da EA.

Estética "vibe coding": dashboard estilo terminal/HUD, dark mode, tipografia mono para
dados, glow verde puxando pra identidade visual do clube.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** com design tokens customizados
- **Prisma** + Postgres (cache local dos dados da EA)
- **Recharts** para gráficos
- Sincronização via job agendado, não chamada direta na hora do acesso

## Por que cache e não chamada direta na API da EA?

O link que você tem (`ea.com/.../clubs/match-history?clubId=...`) é a página do site,
não uma API pública documentada. Existe um endpoint não-oficial
(`proclubs.ea.com/api/fc/clubs/...`) usado pela comunidade, mas ele:

- não tem SLA nem documentação oficial;
- já ficou fora do ar por dias seguidos sem aviso;
- pode ter rate limit ou mudar de formato a qualquer momento.

Por isso este projeto **nunca** busca dado da EA na hora que alguém abre o site. Um job
roda de tempos em tempos, salva tudo num banco Postgres, e o site sempre lê do banco.
Se a EA cair, o site continua no ar mostrando os últimos dados sincronizados.

## Estrutura

```
jovem-nuggs-fc/
├── MANUS_PROMPT.md        ← instruções de como continuar o projeto, em fases
├── docs/
│   └── ea-endpoints.md    ← endpoints não-oficiais da EA usados aqui
├── prisma/
│   └── schema.prisma      ← modelo de dados (Club, Member, Match, MatchAppearance)
└── src/
    ├── app/                ← páginas (App Router)
    │   ├── page.tsx            → Visão Geral
    │   ├── membros/             → Elenco
    │   ├── jogador/[tag]/       → Perfil de jogador
    │   ├── partidas/            → Histórico de partidas
    │   └── api/sync/route.ts   → dispara a sincronização com a EA
    ├── components/         ← componentes de UI reutilizáveis
    ├── lib/                ← cliente EA, prisma client, tipos, utils
    └── scripts/            ← script de sincronização (cron)
```

## Como rodar

```bash
npm install
cp .env.example .env        # preencher DATABASE_URL e CLUB_ID
npx prisma migrate dev
npm run sync                 # busca os dados reais da EA e popula o banco
npm run dev
```

## Próximos passos

Ver `MANUS_PROMPT.md` — o projeto está estruturado mas as chamadas reais à API da EA
e a ligação das páginas ao banco de dados são o próximo passo (Fase 1 e 2).
