import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Loader } from "@/components/Loader";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CardSpotlight } from "@/components/effects/CardSpotlight";
import { Cursor } from "@/components/effects/Cursor";
import { Grain } from "@/components/effects/Grain";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { profile } from "@/data/profile";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

// TODO: once deployed, set NEXT_PUBLIC_SITE_URL in Vercel to your custom domain (Vercel's own URL is used otherwise).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description = `Portfolio of ${profile.name}, ${profile.role.toLowerCase()} from ${profile.location}. ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — Portfolio`,
    template: `%s — ${profile.shortName}.`,
  },
  description,
  authors: [{ name: profile.name, url: profile.github.url }],
  openGraph: {
    type: "website",
    title: `${profile.name} — Portfolio`,
    description,
    siteName: `${profile.shortName}.`,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  colorScheme: "dark",
};

// Runs before paint so the intro loader never flashes on repeat visits in a session.
const introScript = `try{if(sessionStorage.getItem("intro-seen"))document.documentElement.dataset.intro="seen";}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Loader />
        <SmoothScroll />
        <ScrollProgress />
        <Grain />
        <Cursor />
        <CardSpotlight />
        <MotionProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
