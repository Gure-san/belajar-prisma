import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s - Experiment",
    default: "Experiment",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
