import type { Metadata } from "next";
import { IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TalkBook – Talk to Your Books",
  description:
    "Transform your books into interactive AI conversations. Upload PDFs and have a live voice conversation with your book's content.",
  keywords: ["AI", "books", "voice chat", "PDF", "reading", "TalkBook"],
  openGraph: {
    title: "TalkBook – Talk to Your Books",
    description:
      "Transform your books into interactive AI conversations. Upload PDFs and have a live voice conversation with your book's content.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ClerkProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
