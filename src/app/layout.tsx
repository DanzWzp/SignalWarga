import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { APP_NAME } from "@/lib/constants";
import { absoluteUrl, defaultSeo } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  applicationName: APP_NAME,
  title: {
    default: defaultSeo.title,
    template: `%s | ${APP_NAME}`,
  },
  description: defaultSeo.description,
  keywords: defaultSeo.keywords,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/signalwarga-mark.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/signalwarga-mark.png", type: "image/png" }],
  },
  openGraph: {
    title: defaultSeo.title,
    description: defaultSeo.description,
    url: "/",
    siteName: APP_NAME,
    locale: "id_ID",
    type: "website",
    images: ["/signalwarga-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.title,
    description: defaultSeo.description,
    images: ["/signalwarga-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_NAME,
  url: absoluteUrl("/"),
  description: defaultSeo.description,
  inLanguage: "id-ID",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
