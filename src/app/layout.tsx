// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "TrueLine Dynamics",
  description: "Premium CNC Tooling Supplier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <CartProvider>
            <Header />
            {children}
        </CartProvider>
      </body>
    </html>
  );
}