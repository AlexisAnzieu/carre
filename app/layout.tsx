import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carre Musique",
  description: "Vos sessions sonores itinérantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
