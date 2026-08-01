import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_NAME } from "@/utils/constants";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import { cn } from "@/utils/tailwind.util";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "Rastreie encomendas por CPF no SSW.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: APP_NAME,
    title: APP_NAME,
    description: "Painel logístico e rastreamento de encomendas por CPF.",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: "Painel logístico e rastreamento de encomendas por CPF.",
  },
  icons: {
    icon: "/images/sacflow-icon.svg",
    shortcut: "/images/sacflow-icon.svg",
    apple: "/images/sacflow-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-full bg-neutral-100 text-slate-900">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
