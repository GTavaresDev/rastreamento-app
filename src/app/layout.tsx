import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME } from "@/utils/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${APP_NAME} - Rastreamento Logístico`,
  description: "Consulta de encomendas por CPF",
  icons: {
    icon: [
      { url: "/images/sacflow-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/images/sacflow-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={`${inter.variable} min-h-full bg-neutral-100 text-slate-900 font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
