import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { LoadingProvider } from "@/lib/loading-context";

export const metadata: Metadata = {
  title: "La Elegance - Premium Pakistani Heritage Fashion",
  description: "Where Pakistani heritage meets modern elegance. Discover premium clothing that celebrates artisan craftsmanship and cultural sophistication.",
  keywords: "premium fashion, Pakistani heritage, luxury clothing, modern elegance, artisan craftsmanship",
  authors: [{ name: "La Elegance" }],
  creator: "La Elegance",
  publisher: "La Elegance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://evelon.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://evelon.com',
    siteName: 'La Elegance',
    title: 'La Elegance - Premium Pakistani Heritage Fashion',
    description: 'Where Pakistani heritage meets modern elegance.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Elegance - Premium Pakistani Heritage Fashion',
    description: 'Where Pakistani heritage meets modern elegance.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Critical CSS preload */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Viewport meta for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />
        
        {/* Disable automatic detection */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className="font-inter overflow-x-hidden">
        <LoadingProvider>
          <CartProvider>
            <Navigation />
            <main className="min-h-screen bg-background">
              {children}
            </main>
            <Footer />
            <Toaster />
          </CartProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
