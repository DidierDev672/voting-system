import type { Metadata } from "next";
// import { hydrateRoot } from "react-dom/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de votación",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased bg-[#faf8f5] text-[#3d2f1f] font-light h-full">
        {children}
      </body>
    </html>
  );
}
