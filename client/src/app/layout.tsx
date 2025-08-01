import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sevenlift - your the best gym bro.",
  description: "Create training program powered by AI or create custom one by yourself with 100+ exercises in the list.",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
