# Endpoints da EA (não-oficiais)

⚠️ Nenhum destes endpoints é documentado ou suportado oficialmente pela EA. Foram
mapeados pela comunidade de devs de Pro Clubs. Podem mudar ou ficar fora do ar sem
aviso — por isso todo acesso passa pelo `ea-client.ts` com timeout + retry, e o site
nunca depende deles em tempo real (ver README).

Base: `https://proclubs.ea.com/api/fc/`

Parâmetros comuns:
- `platform`: `common-gen5` (PS5/Xbox Series/PC), `common-gen4` (PS4/Xbox One)
- `clubIds`: id numérico do clube (o nosso: `8044401`)

## Visão geral do clube

```
GET /clubs/overallStats?platform=common-gen5&clubIds=8044401
```
Retorna: nome, escudo (id), vitórias/empates/derrotas, rating de habilidade, gols
marcados/sofridos, partidas jogadas.

## Membros / elenco

```
GET /members/stats?platform=common-gen5&clubId=8044401
```
Retorna lista de jogadores com: nome, posição favorita, overall, partidas jogadas,
gols, assistências, passes certos/tentados, nota média, etc.

## Histórico de partidas

```
GET /clubs/matches?matchType=leagueMatch&platform=common-gen5&clubIds=8044401
GET /clubs/matches?matchType=playoffMatch&platform=common-gen5&clubIds=8044401
GET /clubs/matches?matchType=friendlyMatch&platform=common-gen5&clubIds=8044401
```
Retorna as últimas partidas (a EA costuma limitar a ~5-10 mais recentes por chamada),
com placar, adversário, timestamp e, dentro de `players`, as estatísticas individuais
de cada jogador naquela partida (essencial pra página de perfil de jogador).

## Boas práticas ao consumir

- Sempre definir um `User-Agent` de navegador comum (alguns proxies da EA bloqueiam
  requisições sem isso).
- Tratar `429` (rate limit) com backoff exponencial, não retry imediato.
- Tratar respostas `200` com corpo de erro HTML/genérico (acontece quando a EA está
  instável) como falha, não como sucesso vazio.
- Rodar a sincronização a cada 3–6h é suficiente — o próprio painel da EA já mostra
  as partidas com atraso de "X horas atrás".
- Guardar o payload bruto (`rawPayload` no schema) além dos campos normalizados, pra
  não perder dado se um campo novo aparecer antes de você atualizar o código.
