import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NODE_ENV === "production"
    ? "https://www.flappydick.io"
    : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const shareUrl = `${siteUrl}/share-v3`;
const ogImagePath = "/og-card-final-approved-v2.png";

export const metadata: Metadata = {
  title: "Flappy Dick",
  description: "The browser arcade game you didn't ask for. Dodge the pipes. Top the leaderboard.",
  openGraph: {
    type: "website",
    url: shareUrl,
    title: "Flappy Dick",
    description: "The browser arcade game you didn't ask for. Dodge the pipes. Top the leaderboard.",
    siteName: "Flappy Dick",
    images: [
      {
        url: ogImagePath,
        width: 1024,
        height: 537,
        alt: "Flappy Dick — the browser arcade game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flappy Dick",
    description: "The browser arcade game you didn't ask for. Dodge the pipes. Top the leaderboard.",
    images: [ogImagePath],
  },
};

export default function ShareV3Page() {
  return (
    <main className="pageRoot">
      <section className="panel">
        <h1>Flappy Dick</h1>
        <p>The browser arcade game you didn&apos;t ask for. Dodge the pipes. Top the leaderboard.</p>
        <Link href="/">Play now</Link>
      </section>
    </main>
  );
}
