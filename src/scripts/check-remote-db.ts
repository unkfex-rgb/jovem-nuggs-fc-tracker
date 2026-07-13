import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_xX30vYpQeTmL@ep-cool-darkness-a5n378k0-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function main() {
  console.log("--- DIAGNÓSTICO DO BANCO REMOTO ---");
  
  const clubs = await prisma.club.findMany();
  console.log(`Clubes encontrados: ${clubs.length}`);
  clubs.forEach(c => console.log(`- ${c.name} (eaClubId: ${c.eaClubId})`));

  const members = await prisma.member.findMany();
  console.log(`Membros encontrados: ${members.length}`);

  const matches = await prisma.match.findMany();
  console.log(`Partidas encontradas: ${matches.length}`);

  console.log("-----------------------------------");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
