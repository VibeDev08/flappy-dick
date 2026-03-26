import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Flappy Dick",
  description: "The browser arcade game you didn't ask for. Dodge the pipes. Top the leaderboard.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Flappy Dick",
    description: "The browser arcade game you didn't ask for. Dodge the pipes. Top the leaderboard.",
    siteName: "Flappy Dick",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Flappy Dick — the browser arcade game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flappy Dick",
    description: "The browser arcade game you didn't ask for. Dodge the pipes. Top the leaderboard.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
