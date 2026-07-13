import { fetchClubOverview, fetchClubMembers, fetchClubMatches } from "../lib/ea-client";

const CLUB_ID = "8044401";
const PLATFORM = "common-gen5";

async function test() {
  try {
    console.log("--- TESTANDO OVERVIEW ---");
    const overview = await fetchClubOverview(CLUB_ID, PLATFORM);
    console.log("Overview mapeado:", JSON.stringify(overview, null, 2));

    console.log("\n--- TESTANDO MEMBROS ---");
    const members = await fetchClubMembers(CLUB_ID, PLATFORM);
    console.log(`Membros encontrados: ${members.length}`);
    if (members.length > 0) {
      console.log("Primeiro membro mapeado:", JSON.stringify(members[0], null, 2));
    }

    console.log("\n--- TESTANDO PARTIDAS (LEAGUE) ---");
    const matches = await fetchClubMatches(CLUB_ID, PLATFORM, "LEAGUE");
    console.log(`Partidas encontradas: ${matches.length}`);
    if (matches.length > 0) {
      console.log("Primeira partida mapeada:", JSON.stringify(matches[0], null, 2));
    }
  } catch (err) {
    console.error("Erro no teste:", err);
  }
}

test();
