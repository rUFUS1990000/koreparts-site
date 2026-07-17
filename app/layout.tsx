import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import {
  SITE_NAME,
  SITE_TAGLINE,
  TELEGRAM_CHANNEL_URL,
  TELEGRAM_URL,
  THEME_INIT_SCRIPT,
} from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://koreparts.example.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fa" },
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — запчасти Kia, Hyundai, Genesis, SsangYong`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Интернет-магазин автозапчастей для корейских автомобилей: фильтры, тормоза, подвеска, электрика. 1400+ позиций с OEM. Заявка на подбор, доставка по РФ. Канал t.me/KoreParts · бот @KorePartsBot.",
  applicationName: SITE_NAME,
  keywords: [
    "KoreParts",
    "запчасти Kia",
    "запчасти Hyundai",
    "запчасти Genesis",
    "запчасти SsangYong",
    "Kia Rio запчасти",
    "Hyundai Solaris",
    "Hyundai Creta",
    "Hyundai Tucson",
    "Kia Sorento",
    "корейские автозапчасти",
    "OEM",
    "колодки",
    "фильтры масляные",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
    shortcut: ["/favicon.svg"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Каталог запчастей Kia, Hyundai, Genesis, SsangYong. OEM, заявка, доставка по России.",
    images: [
      {
        url: "/logo.png",
        width: 1400,
        height: 467,
        alt: "KoreParts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: "/" },
  other: {
    "telegram:channel": TELEGRAM_CHANNEL_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url: siteUrl,
    sameAs: [TELEGRAM_CHANNEL_URL, TELEGRAM_URL],
    priceRange: "₽₽",
    areaServed: "RU",
  };

  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
