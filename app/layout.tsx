import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kay Reads! | A Book Girly's Reading Corner",
  description: "Honest, heartfelt book reviews from a passionate reader. Discover your next favorite read!",
  keywords: "book reviews, reading, books, literature, book recommendations",
  authors: [{ name: "Kay Reads" }],
  openGraph: {
    title: "Kay Reads! | A Book Girly's Reading Corner",
    description: "Honest, heartfelt book reviews from a passionate reader. Discover your next favorite read!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kay Reads! | A Book Girly's Reading Corner",
    description: "Honest, heartfelt book reviews from a passionate reader. Discover your next favorite read!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
