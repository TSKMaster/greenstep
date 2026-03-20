import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenStep",
  description: "MVP веб-приложения GreenStep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
