import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { ClientProvider } from "@/components/ClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Planner - Manage Your Recipes & Meal Plans",
  description: "A personal recipe management app for organizing recipes, planning meals, and managing grocery lists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <ClientProvider>
          <Navigation />
          <MobileNav />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}
