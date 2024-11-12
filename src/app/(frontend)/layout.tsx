import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Viewport, type Metadata } from "next";
import { Navigation } from "~/components/navigation";

const APPLE_ICON_SIZES = [57, 72, 76, 114, 120, 144, 152, 180] as const;

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "MealReveal",
  description: "Stop calorie counting. Just snap a picture of your meal!",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    // Generate apple touch icons for all sizes
    ...APPLE_ICON_SIZES.map((size) => ({
      rel: "apple-touch-icon",
      sizes: `${size}x${size}`,
      url: `/apple-touch-icon/${size}x${size}.png`,
    })),
    // Default apple-touch-icon
    { rel: "apple-touch-icon", url: "/apple-touch-icon/default.png" },
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MealReveal",
  },
  formatDetection: {
    telephone: false,
  },
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        {children}
        <Navigation />
      </body>
    </html>
  );
}
