import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oli's Kitchen",
  description: "The Recipe Vault",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* This meta tag helps prevent font-scaling issues on mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#000",
          color: "#fff",
          minHeight: "100vh",
          // The "Golden" System Font Stack
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {children}
      </body>
    </html>
  );
}