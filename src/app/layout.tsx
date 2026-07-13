import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jovem Nuggs FC — Painel do Clube",
  description: "Estatísticas, elenco e histórico de partidas do Jovem Nuggs FC.",
};

const NAV = [
  { href: "/", label: "visão geral" },
  { href: "/membros", label: "elenco" },
  { href: "/partidas", label: "partidas" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-ink-950 font-sans text-fog-300 antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
          <header className="flex items-center justify-between border-b border-ink-700/60 py-5">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-mint-500/40 bg-mint-500/10 font-mono text-sm font-bold text-mint-400 shadow-glow">
                JN
              </span>
              <span className="font-mono text-sm tracking-tight text-paper-100">
                jovem<span className="text-mint-400">_</span>nuggs
                <span className="text-fog-500">.fc</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 font-mono text-xs">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded px-3 py-1.5 text-fog-500 transition-colors hover:bg-ink-800 hover:text-mint-400"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <main className="flex-1 py-10">{children}</main>

          <footer className="flex items-center justify-between border-t border-ink-700/60 py-6 font-mono text-[11px] text-fog-500">
            <span>
              dados via <span className="text-fog-300">EA Sports FC Clubs</span> · não afiliado à EA
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-500 animate-blink" />
              painel ativo
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
