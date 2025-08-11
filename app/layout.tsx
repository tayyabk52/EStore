import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "EVELON - Premium Pakistani Heritage Fashion",
  description: "Where Pakistani heritage meets modern elegance. Discover premium clothing that celebrates artisan craftsmanship and cultural sophistication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="font-inter overflow-x-hidden">
        <CartProvider>
          <Navigation />
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
