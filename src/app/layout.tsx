import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Caveat } from "next/font/google";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { LanguageProvider } from "../contexts/LanguageContext";
import { LikeProvider } from "../contexts/LikeContext";
import { CommentProvider } from "../contexts/CommentContext";
import { AuthProvider } from "../contexts/AuthContext";
import { getMetadataCardImage } from "@/lib/ui/fallback-visuals";
import "./globals.css";
import "./components.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-hero",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-decor",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hackathon University | Build The Next Outlier Archive",
  description: "Join the most exclusive creator archive and hackathon platform. We engineer the UNNECESSARY. Discover S-tier events, connect with builders, and upvote the greatest projects in the world.",
  keywords: ["hackathon", "web3", "ai", "hardware", "builders", "outliers", "startup", "projects"],
  openGraph: {
    title: "Hackathon University - Global Outlier Community",
    description: "Build the next generation of autonomous agents and decentralize everything. Find your next battleground.",
    images: [{ url: getMetadataCardImage("hackuni"), width: 1200, height: 630, alt: "Hackathon University Demo Image" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackathon University",
    description: "We engineer the UNNECESSARY.",
    images: [getMetadataCardImage("hackuni")],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} ${caveat.variable}`}>
      <body style={{ fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <LanguageProvider>
          <AuthProvider>
            <LikeProvider>
              <CommentProvider>
                <Navbar />
                <div style={{ flex: 1 }}>{children}</div>
                <Footer />
              </CommentProvider>
            </LikeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
