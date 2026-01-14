import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://trueline-dynamics.com'),
  title: {
    template: '%s | TrueLine Dynamics',
    default: 'TrueLine Dynamics - Premium CNC Tooling & Industrial Supplies',
  },
  description: "Shop high-performance CNC carbide cutters, end mills, drills, and industrial tools. TrueLine Dynamics offers enterprise-grade tooling for precision manufacturing.",
  openGraph: {
    title: 'TrueLine Dynamics - Premium CNC Tooling',
    description: 'Shop high-performance CNC carbide cutters and industrial tools.',
    url: 'https://trueline-dynamics.com',
    siteName: 'TrueLine Dynamics',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#4ADE80] selection:text-black">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}