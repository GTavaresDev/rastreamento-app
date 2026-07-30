import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_NAME } from "@/utils/constants";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Rastreie encomendas por CPF no SSW.",
  icons: {
    icon: "/images/hyerlogo.jpg",
    shortcut: "/images/hyerlogo.jpg",
    apple: "/images/hyerlogo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full bg-slate-50 text-slate-900">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
