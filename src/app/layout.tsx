import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snaque",
  description: "Lekker",
  
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className="h-full">
      <body
        className={[
          "min-h-screen text-slate-100 antialiased",
          geistSans.variable,
          geistMono.variable,
        ].join(" ")}
        style={{
          /* Donker navy basis (ipv zwart) */
          backgroundColor: "#0e1330",
          /* Direct op body: blauw + beige radials, subtiel maar zichtbaar */
          backgroundImage: `
            radial-gradient(1200px 600px at 20% -10%, rgba(24, 0, 173, 0.30), transparent 60%),
            radial-gradient(900px 500px at 85% -10%, rgba(24, 0, 173, 0.24), transparent 60%),
            radial-gradient(800px 420px at 50% 115%, rgba(244, 245, 211, 0.10), transparent 60%)
          `,
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          backgroundAttachment: "fixed, fixed, fixed",
          backgroundSize: "auto, auto, auto",
        }}
      >
        {/* Geen overlay-divs meer die het effect afzwakken */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
