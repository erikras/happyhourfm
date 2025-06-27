import "./globals.css";

export const metadata = {
  title: "Happy Hour with Dennis and Erik",
  description: "A podcast about life, comedy, and everything in between",
  metadataBase: new URL("https://happyhour.fm"),
  openGraph: {
    title: "Happy Hour with Dennis and Erik",
    description: "A podcast about life, comedy, and everything in between",
    images: ["https://happyhour.fm/art.jpg"],
    type: "website",
    siteName: "Happy Hour with Dennis and Erik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Hour with Dennis and Erik",
    description: "A podcast about life, comedy, and everything in between",
    images: ["https://happyhour.fm/art.jpg"],
    creator: "@happyhourdotfm",
    site: "@happyhourdotfm",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
