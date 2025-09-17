import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/design-system/components";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nordia POS",
  description: "POS mobile-first para PyMEs",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
