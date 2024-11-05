import { Metadata } from "next";

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
    <html>
      <body>{children}</body>
    </html>
  );
}
