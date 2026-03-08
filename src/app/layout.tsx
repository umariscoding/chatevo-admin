import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Chatelio - Chatbot as a Service",
  description: "Multi-tenant chatbot platform for businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={dmSans.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
