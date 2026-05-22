import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C5 México — Centro de Control, Comando y Cómputo",
  description: "Plataforma de monitoreo inteligente y gestión de emergencias para el Mundial FIFA 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "var(--font-body)" }}>{children}</body>
    </html>
  );
}
