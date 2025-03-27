import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pomodoro-sortof",
  description: "My modified pomodoro",
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
