import type { Metadata } from "next";
import { Comic_Neue, Montserrat } from "next/font/google";
import "./globals.css";
import { LayoutHeaderFooter } from "@/components/layout/LayoutHeaderFooter";
import { Providers } from "./providers";
import { PricingProvider } from "@/contexts/PricingContext";
import { getPricing } from "@/lib/pricing";

import Script from "next/script";

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Printpop",
  description: "Printpop - Your one-stop shop for all your printing needs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pricingData = await getPricing();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${comicNeue.variable} ${montserrat.variable} antialiased bg-background text-foreground font-sans`}
      >
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z2J5QHWC0L"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z2J5QHWC0L');
          `}
        </Script>
        <PricingProvider initialPricing={pricingData}>
          <Providers>
            <LayoutHeaderFooter>
              {children}
            </LayoutHeaderFooter>
          </Providers>
        </PricingProvider>
      </body>
    </html>
  );
}
