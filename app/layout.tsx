import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
