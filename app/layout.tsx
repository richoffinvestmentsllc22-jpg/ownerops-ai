import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OwnerOps AI",
  description: "AI-powered business operating system for small service businesses"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
