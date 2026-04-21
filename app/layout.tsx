import type { Metadata } from "next";
import { Nunito, Dancing_Script } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ 
  subsets: ["latin"],
  variable: '--font-dancing-script',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Love Dates",
  description:
    "Creado para facilitar planificar y tener nuevas ideas de citas en pareja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} ${dancingScript.variable}`}>{children}</body>
    </html>
  );
}
