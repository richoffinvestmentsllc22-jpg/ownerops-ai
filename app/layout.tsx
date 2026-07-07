import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OwnerOps AI",
  description: "AI-powered business operating system for small service businesses",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
